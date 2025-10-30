<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\FacturaPago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function create(Factura $factura)
    {
        return Inertia::render('Pagos/Create', [
            'factura' => $factura->load(['cliente', 'pagos']),
        ]);
    }

    public function store(Request $request, Factura $factura)
    {
        $saldoPendiente = $factura->total - $factura->pagos->sum('monto');

        $request->validate([
            'monto' => 'required|numeric|min:1|max:' . $saldoPendiente,
            'metodo_pago' => 'required|string',
            'fecha_pago' => 'required|date',
            'observaciones' => 'nullable|string',
        ]);

        FacturaPago::create([
            'factura_id' => $factura->id,
            'monto' => $request->monto,
            'metodo_pago' => $request->metodo_pago,
            'fecha_pago' => $request->fecha_pago,
            'observaciones' => $request->observaciones,
        ]);

        // Recargar pagos y actualizar estado de factura
        $factura->load('pagos');
        $totalPagado = $factura->pagos->sum('monto');
        $saldoPendiente = $factura->total - $totalPagado;

        $factura->update([
            'pagada' => $saldoPendiente <= 0 ? 'SI' : 'NO',
        ]);

        return redirect()->route('ventas.show', $factura->id)
                        ->with('success', 'Pago registrado exitosamente');
    }

    public function destroy(FacturaPago $pago)
    {
        $factura = $pago->factura;
        $pago->delete();

        // Recargar pagos y actualizar estado de factura
        $factura->load('pagos');
        $totalPagado = $factura->pagos->sum('monto');
        $saldoPendiente = $factura->total - $totalPagado;

        $factura->update([
            'pagada' => $saldoPendiente <= 0 ? 'SI' : 'NO',
        ]);

        return redirect()->route('ventas.show', $factura->id)
                        ->with('success', 'Pago eliminado exitosamente');
    }
}
