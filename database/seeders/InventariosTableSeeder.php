<?php

namespace Database\Seeders;

use App\Models\Articulo;
use App\Models\Inventario;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class InventariosTableSeeder extends Seeder
{
    public function run()
    {
        $articulos = Articulo::all();
        $suppliers = Supplier::all();

        $inventarios = [
            [
                'articulo_id' => 1, // LEGO Classic
                'cantidad' => 25,
                'lote' => 2024001,
                'vencimiento' => null,
                'supplier_id' => 5, // Distribuidora LEGO Argentina
            ],
            [
                'articulo_id' => 2, // Barbie Fashionista
                'cantidad' => 40,
                'lote' => 2024002,
                'vencimiento' => null,
                'supplier_id' => 1, // Distribuidora Juguetes SA
            ],
            [
                'articulo_id' => 3, // Hot Wheels Pack 5
                'cantidad' => 60,
                'lote' => 2024003,
                'vencimiento' => null,
                'supplier_id' => 2, // Importadora Toys SRL
            ],
            [
                'articulo_id' => 4, // Peluche Oso Teddy
                'cantidad' => 15,
                'lote' => 2024004,
                'vencimiento' => null,
                'supplier_id' => 4, // Proveedor Peluches Norte
            ],
            [
                'articulo_id' => 5, // Rompecabezas Números y Letras
                'cantidad' => 30,
                'lote' => 2024005,
                'vencimiento' => null,
                'supplier_id' => 3, // Mayorista Didácticos
            ],
            [
                'articulo_id' => 6, // Play-Doh Set Cocina
                'cantidad' => 35,
                'lote' => 2024006,
                'vencimiento' => '2026-12-31',
                'supplier_id' => 1, // Distribuidora Juguetes SA
            ],
            [
                'articulo_id' => 7, // Nerf Elite Disruptor
                'cantidad' => 20,
                'lote' => 2024007,
                'vencimiento' => null,
                'supplier_id' => 2, // Importadora Toys SRL
            ],
            [
                'articulo_id' => 8, // Fisher-Price Teléfono
                'cantidad' => 50,
                'lote' => 2024008,
                'vencimiento' => null,
                'supplier_id' => 1, // Distribuidora Juguetes SA
            ],
        ];

        foreach ($inventarios as $inventario) {
            Inventario::create($inventario);
        }
    }
}
