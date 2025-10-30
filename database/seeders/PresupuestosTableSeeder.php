<?php

use App\Articulo;
use App\Presupuesto;
use Illuminate\Database\Seeder;

class PresupuestosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Presupuesto::class, 7)->create();
        $presupuestos = Presupuesto::all();
        $total = 0;
        $articulos = Articulo::all();
        foreach ($presupuestos as $presupuesto) {
            $entero = rand(1, count($articulos));
            $articulo = Articulo::find($entero);
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
                'presupuesto_id' => $presupuesto->id,
            ];
            $total = $detalle['subtotal'] + $total;
            $det[] = $detalle;
            $presupuesto->articulos()->attach($det);
            unset($det);
            $presupuesto->total = $total;
            $presupuesto->save();
        }
    }
}
