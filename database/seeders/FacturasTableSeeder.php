<?php

use App\Articulo;
use App\Factura;
use App\Inventario;
use App\Movimiento;
use Illuminate\Database\Seeder;

class FacturasTableSeeder extends Seeder
{
    public function run()
    {
        factory(Factura::class, 7)->create();
        $facturas = Factura::all();
        $total = 0;
        $inventarios = Inventario::all();
        foreach ($facturas as $factura) {
            $entero = rand(1, count($inventarios));
            $inventario = Inventario::find($entero);
            $idaux = $inventario->articulo_id;
            $articulo = Articulo::find($idaux);
            $detalle = [
                'codprov' => $articulo['codprov'],
                'codarticulo' => $articulo['codarticulo'],
                'articulo' => $articulo['articulo'],
                'cantidad' => 1,
                'medida' => 'unidades',
                'bonificacion' => 0,
                'alicuota' => 0,
                'preciounitario' => $articulo['precio'],
                'subtotal' => 1 * $articulo['precio'],
                'articulo_id' => $articulo['id'],
                'factura_id' => $factura->id,
            ];
            $total = $detalle['subtotal'] + $total;
            $det[] = $detalle;
            $factura->articulos()->attach($det);
            unset($det);
            $factura->total = $total;
            $factura->save();
            $inventario->cantidad = $inventario->cantidad - $detalle['cantidad'];
            Movimiento::create([
                'inventario_id' => $inventario->id,
                'tipo' => 'VENTA',
                'cantidad' => $detalle['cantidad'],
                'fecha' => now()->format('Y-m-d'),
                'numcomprobante' => $factura->id,
                'user_id' => 1,
            ]);
        }
    }
}
