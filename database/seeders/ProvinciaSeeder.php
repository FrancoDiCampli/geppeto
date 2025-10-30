<?php

namespace Database\Seeders;

use App\Models\Localidad;
use App\Models\Provincia;
use Illuminate\Database\Seeder;

class ProvinciaSeeder extends Seeder
{
    public function run(): void
    {
        $chaco = Provincia::create(['nombre' => 'Chaco']);

        $localidades = [
            'Resistencia',
            'Barranqueras',
            'Fontana',
            'Puerto Vilelas',
            'Margarita Belén',
            'Presidencia Roque Sáenz Peña',
            'Villa Ángela',
            'Charata',
            'Quitilipi',
            'General José de San Martín',
        ];

        foreach ($localidades as $localidad) {
            Localidad::create([
                'nombre' => $localidad,
                'provincia_id' => $chaco->id,
            ]);
        }
    }
}
