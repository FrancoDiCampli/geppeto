<?php

use Database\Seeders\ArticulosTableSeeder;
use Database\Seeders\CategoriasTableSeeder;
use Database\Seeders\ClientesTableSeeder;
use Database\Seeders\InitialSettingsSeeder;
use Database\Seeders\InventariosTableSeeder;
use Database\Seeders\ListaPrecioSeeder;
use Database\Seeders\MarcasTableSeeder;
use Database\Seeders\ProvinciaSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SuppliersTableSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ProvinciaSeeder::class);
        $this->call(ClientesTableSeeder::class);
        $this->call(CategoriasTableSeeder::class);
        $this->call(MarcasTableSeeder::class);
        $this->call(SuppliersTableSeeder::class);
        $this->call(ArticulosTableSeeder::class);
        $this->call(InventariosTableSeeder::class);
        $this->call(InitialSettingsSeeder::class);
        $this->call(ListaPrecioSeeder::class);
    }
}
