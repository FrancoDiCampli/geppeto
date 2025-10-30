<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::all();

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@mail.com',
            'password' => bcrypt('asdf1234'),
            'role_id' => $roles->where('role', 'superadmin')->first()->id,
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('asdf1234'),
            'role_id' => $roles->where('role', 'admin')->first()->id,
        ]);

        User::create([
            'name' => 'Vendedor',
            'email' => 'vendedor@mail.com',
            'password' => bcrypt('asdf1234'),
            'role_id' => $roles->where('role', 'vendedor')->first()->id,
        ]);
    }
}
