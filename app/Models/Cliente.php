<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $fillable = [
        'razonsocial',
        'documentounico',
        'direccion',
        'telefono',
        'email',
        'codigopostal',
        'localidad',
        'provincia',
        'condicioniva',
    ];

    public function facturas()
    {
        return $this->hasMany(Factura::class);
    }
}
