<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriasTableSeeder extends Seeder
{
    public function run()
    {
        $categorias = [
            'Didácticos',
            'Peluches',
            'Muñecas',
            'Autos y Vehículos',
            'Construcción',
            'Juegos de Mesa',
            'Deportes',
            'Electrónicos',
            'Arte y Manualidades',
            'Bebés',
        ];

        foreach ($categorias as $categoria) {
            Categoria::create([
                'categoria' => $categoria,
            ]);
        }
    }
}
