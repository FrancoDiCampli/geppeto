<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciasAfipSeeder extends Seeder
{
    public function run(): void
    {
        $provincias = [
            ['nombre' => 'CIUDAD AUTONOMA BUENOS AIRES', 'id_afip' => 0],
            ['nombre' => 'BUENOS AIRES', 'id_afip' => 1],
            ['nombre' => 'CATAMARCA', 'id_afip' => 2],
            ['nombre' => 'CORDOBA', 'id_afip' => 3],
            ['nombre' => 'CORRIENTES', 'id_afip' => 4],
            ['nombre' => 'ENTRE RIOS', 'id_afip' => 5],
            ['nombre' => 'JUJUY', 'id_afip' => 6],
            ['nombre' => 'MENDOZA', 'id_afip' => 7],
            ['nombre' => 'LA RIOJA', 'id_afip' => 8],
            ['nombre' => 'SALTA', 'id_afip' => 9],
            ['nombre' => 'SAN JUAN', 'id_afip' => 10],
            ['nombre' => 'SAN LUIS', 'id_afip' => 11],
            ['nombre' => 'SANTA FE', 'id_afip' => 12],
            ['nombre' => 'SANTIAGO DEL ESTERO', 'id_afip' => 13],
            ['nombre' => 'TUCUMAN', 'id_afip' => 14],
            ['nombre' => 'CHACO', 'id_afip' => 16],
            ['nombre' => 'CHUBUT', 'id_afip' => 17],
            ['nombre' => 'FORMOSA', 'id_afip' => 18],
            ['nombre' => 'MISIONES', 'id_afip' => 19],
            ['nombre' => 'NEUQUEN', 'id_afip' => 20],
            ['nombre' => 'LA PAMPA', 'id_afip' => 21],
            ['nombre' => 'RIO NEGRO', 'id_afip' => 22],
            ['nombre' => 'SANTA CRUZ', 'id_afip' => 23],
            ['nombre' => 'TIERRA DEL FUEGO', 'id_afip' => 24],
        ];

        foreach ($provincias as $provincia) {
            DB::table('provincias')->updateOrInsert(
                ['nombre' => $provincia['nombre']],
                ['id_afip' => $provincia['id_afip']]
            );
        }
    }
}