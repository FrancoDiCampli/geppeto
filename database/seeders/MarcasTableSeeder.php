<?php

namespace Database\Seeders;

use App\Models\Marca;
use Illuminate\Database\Seeder;

class MarcasTableSeeder extends Seeder
{
    public function run()
    {
        $marcas = [
            'Mattel',
            'Hasbro',
            'LEGO',
            'Fisher-Price',
            'Barbie',
            'Hot Wheels',
            'Playmobil',
            'Melissa & Doug',
            'VTech',
            'LeapFrog',
            'Crayola',
            'Play-Doh',
            'Nerf',
            'Transformers',
            'Disney',
            'Marvel',
            'Paw Patrol',
            'Peppa Pig',
            'Frozen',
            'Toy Story',
        ];

        foreach ($marcas as $marca) {
            Marca::create([
                'marca' => $marca,
            ]);
        }
    }
}
