<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ListaPrecioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('listas_precios')->updateOrInsert(
            ['nombre' => 'Septiembre'],
            [
                'nombre' => 'Septiembre',
                'porcentaje' => 10.00,
                'default_pos' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
