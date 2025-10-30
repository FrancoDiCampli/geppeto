<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SuppliersTableSeeder extends Seeder
{
    public function run()
    {
        $suppliers = [
            [
                'razonsocial' => 'Distribuidora Juguetes SA',
                'cuit' => '30123456789',
                'direccion' => 'Av. Corrientes 1234, CABA',
                'telefono' => '011-4567-8901',
                'email' => 'ventas@juguetessa.com.ar',
            ],
            [
                'razonsocial' => 'Importadora Toys SRL',
                'cuit' => '30987654321',
                'direccion' => 'Av. Santa Fe 5678, CABA',
                'telefono' => '011-2345-6789',
                'email' => 'info@toyssrl.com.ar',
            ],
            [
                'razonsocial' => 'Mayorista Didácticos',
                'cuit' => '30456789123',
                'direccion' => 'Av. Rivadavia 9876, CABA',
                'telefono' => '011-8765-4321',
                'email' => 'pedidos@didacticos.com.ar',
            ],
            [
                'razonsocial' => 'Proveedor Peluches Norte',
                'cuit' => '30654321987',
                'direccion' => 'Av. Cabildo 3456, CABA',
                'telefono' => '011-5432-1098',
                'email' => 'contacto@peluchesnorte.com.ar',
            ],
            [
                'razonsocial' => 'Distribuidora LEGO Argentina',
                'cuit' => '30789123456',
                'direccion' => 'Av. del Libertador 7890, CABA',
                'telefono' => '011-9876-5432',
                'email' => 'argentina@lego.com',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
