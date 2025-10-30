<?php

use App\Articulo;
use App\Inventario;
use App\Movimiento;
use App\Remito;
use Illuminate\Database\Seeder;

class RemitosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Remito::class, 9)->create();
        $remitos = Remito::all();
        $total = 0;
        $inventarios = Inventario::all();
        foreach ($remitos as $remito) {
            $entero = rand(1, count($inventarios));
            $inventario = Inventario::find($entero);
            $idaux = $inventario->articulo_id;
            $articulo = Articulo::find($idaux);
            $detalle = [
                'codprov' => $articulo['codprov'],
                'codarticulo' => $articulo['codarticulo'],
                'articulo' => $articulo['articulo'],
                'cantidad' => 10,
                'medida' => 'unidades',
                'bonificacion' => 0,
                'alicuota' => 0,
                'preciounitario' => $articulo['precio'],
                'subtotal' => 1 * $articulo['precio'],
                'lote' => $entero,
                'articulo_id' => $articulo['id'],
                'remito_id' => $remito->id,
            ];
            $total = $detalle['subtotal'] + $total;
            $det[] = $detalle;
            $remito->articulos()->attach($det);
            unset($det);
            $remito->total = $total;
            $remito->save();
            $inventario->cantidad = $inventario->cantidad + $detalle['cantidad'];
            Movimiento::create([
                'inventario_id' => $inventario->id,
                'tipo' => 'COMPRA',
                'cantidad' => $detalle['cantidad'],
                'fecha' => now()->format('Y-m-d'),
                'numcomprobante' => $remito->id,
                'user_id' => 1,
            ]);
        }
    }
}
