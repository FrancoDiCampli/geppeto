<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\Cliente;
use App\Models\Factura;
use App\Models\Inventario;
use App\Models\ListaPrecio;
use App\Services\AfipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function index()
    {
        return Inertia::render('Ventas/Index', [
            'facturas' => Factura::with(['cliente', 'user', 'articulos', 'entregas'])->latest()->paginate(5),
        ]);
    }

    public function create()
    {
        $listasPrecios = ListaPrecio::all();
        $listaDefaultPos = $listasPrecios->where('default_pos', true)->first();

        return Inertia::render('Ventas/Create', [
            'clientes' => Cliente::all(),
            'articulos' => Articulo::with(['categoria', 'marca', 'listasPrecios', 'imagenes'])->get(),
            'listasPrecios' => $listasPrecios,
            'listaDefaultPos' => $listaDefaultPos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'articulos' => 'required|array|min:1',
            'articulos.*.articulo_id' => 'required|exists:articulos,id',
            'articulos.*.cantidad' => 'required|integer|min:1',
            'articulos.*.precio' => 'required|numeric|min:0',
            'metodo_pago' => 'required|string',
            'monto_pago' => 'required|numeric|min:0',
            'auto_payment' => 'boolean',
            'auto_delivery' => 'boolean',
            'lista_precio_id' => 'nullable|exists:listas_precios,id',
        ]);

        $factura = DB::transaction(function () use ($request) {
            $cliente = Cliente::find($request->cliente_id);
            $subtotal = 0;
            $total = 0;

            // Crear factura
            $factura = Factura::create([
                'ptoventa' => 3,
                'letracomprobante' => 'B',
                'numfactura' => Factura::max('numfactura') + 1,
                'cuit' => $cliente->documentounico,
                'fecha' => now()->format('Y-m-d'),
                'bonificacion' => 0,
                'recargo' => 0,
                'subtotal' => 0,
                'total' => 0,
                'pagada' => 'SI',
                'condicionventa' => 'CONTADO',
                'cliente_id' => $request->cliente_id,
                'user_id' => auth()->id(),
                'lista_precio_id' => $request->lista_precio_id,
                'tipo_venta' => $this->determinarTipoVenta($request),
            ]);

            // Procesar artículos
            foreach ($request->articulos as $item) {
                $articulo = Articulo::find($item['articulo_id']);
                $cantidad = $item['cantidad'];
                $precio = $item['precio'];
                $itemSubtotal = $cantidad * $precio;
                $alicuota = $articulo->alicuota;

                // Agregar a factura
                $factura->articulos()->attach($articulo->id, [
                    'codprov' => $articulo->codprov,
                    'codarticulo' => $articulo->codarticulo,
                    'articulo' => $articulo->articulo,
                    'medida' => $articulo->medida,
                    'cantidad' => $cantidad,
                    'bonificacion' => 0,
                    'alicuota' => $alicuota,
                    'preciounitario' => $precio,
                    'subtotal' => $itemSubtotal,
                ]);

                // Actualizar inventario
                $inventario = Inventario::where('articulo_id', $articulo->id)->first();
                if ($inventario) {
                    $inventario->cantidad -= $cantidad;
                    $inventario->save();
                }

                $subtotal += $itemSubtotal;
            }

            $total = $subtotal;

            // Actualizar totales de factura
            $factura->update([
                'subtotal' => $subtotal,
                'total' => $total,
                'pagada' => $request->monto_pago >= $total ? 'SI' : 'NO',
            ]);

            // Crear pago si hay monto
            if ($request->monto_pago > 0) {
                \App\Models\FacturaPago::create([
                    'factura_id' => $factura->id,
                    'monto' => $request->monto_pago,
                    'metodo_pago' => $request->metodo_pago,
                    'fecha_pago' => now(),
                ]);
            }

            // Crear entregas automáticas si está marcado
            if ($request->auto_delivery) {
                foreach ($request->articulos as $item) {
                    // Crear entrega
                    \App\Models\Entrega::create([
                        'factura_id' => $factura->id,
                        'articulo_id' => $item['articulo_id'],
                        'cantidad' => $item['cantidad'],
                        'fecha_entrega' => now(),
                        'observaciones' => 'Entrega automática al crear la venta',
                    ]);

                    // Descontar del inventario
                    $inventario = Inventario::where('articulo_id', $item['articulo_id'])->first();
                    if ($inventario) {
                        $inventario->cantidad -= $item['cantidad'];
                        $inventario->save();
                    }
                }
            }

            return $factura;
        });

        return redirect()->route('ventas.index')->with('success', 'Venta realizada exitosamente');
    }

    private function determinarTipoVenta(Request $request)
    {
        // Si la URL contiene 'ecommerce' o viene de una ruta de ecommerce
        if (str_contains($request->headers->get('referer', ''), 'ecommerce') ||
            str_contains($request->url(), 'ecommerce')) {
            return 'ecommerce';
        }

        // Por defecto es POS (dashboard)
        return 'pos';
    }

    public function show(Factura $venta)
    {
        return Inertia::render('Ventas/Show', [
            'factura' => $venta->load(['cliente', 'user', 'articulos', 'pagos', 'entregas.articulo']),
        ]);
    }

    public function destroy(Factura $venta)
    {
        DB::transaction(function () use ($venta) {
            // Restaurar inventario
            foreach ($venta->articulos as $articulo) {
                $inventario = Inventario::where('articulo_id', $articulo->id)->first();
                if ($inventario) {
                    $inventario->cantidad += $articulo->pivot->cantidad;
                    $inventario->save();
                }
            }

            $venta->delete();
        });

        return redirect()->route('ventas.index')->with('success', 'Venta eliminada exitosamente');
    }

    public function autorizarAfip(Factura $factura)
    {
        try {
            $afipService = new AfipService();
            $resultado = $afipService->autorizarFactura($factura);
            
            if ($resultado['success']) {
                return redirect()->route('ventas.index')
                    ->with('success', 'Factura autorizada en AFIP correctamente. CAE: ' . $resultado['cae']);
            } else {
                return redirect()->route('ventas.index')
                    ->with('error', 'Error al autorizar en AFIP: ' . $resultado['error']);
            }
        } catch (\Exception $e) {
            return redirect()->route('ventas.index')
                ->with('error', 'Error al autorizar en AFIP: ' . $e->getMessage());
        }
    }
}
