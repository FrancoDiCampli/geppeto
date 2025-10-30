<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Configuración inicial del sistema
        DB::table('inicialsettings')->updateOrInsert(
            ['id' => 1],
            [
                'cuit' => 20123456789,
                'razonsocial' => 'Juguetería Gepetto S.A.',
                'direccion' => 'Av. Principal 123',
                'telefono' => '+54 11 1234-5678',
                'email' => 'info@gepetto.com',
                'codigopostal' => 1000,
                'localidad' => 'Ciudad Autónoma de Buenos Aires',
                'provincia' => 'CABA',
                'condicioniva' => 'Responsable Inscripto',
                'inicioactividades' => '2020-01-01',
                'puntoventa' => 1,
                'nombrefantasia' => 'Gepetto Juguetes',
                'domiciliocomercial' => 'Av. Principal 123, CABA',
                'tagline' => 'Los mejores juguetes para los más pequeños',
                'numfactura' => 1,
                'numremito' => 1,
                'numpresupuesto' => 1,
                'numpago' => 1,
                'numrecibo' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
