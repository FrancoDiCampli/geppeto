<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacturaPago extends Model
{
    protected $table = 'factura_pagos';

    protected $fillable = [
        'factura_id',
        'monto',
        'metodo_pago',
        'fecha_pago',
        'observaciones',
    ];

    protected $casts = [
        'fecha_pago' => 'date',
    ];

    public function factura()
    {
        return $this->belongsTo(Factura::class);
    }
}
