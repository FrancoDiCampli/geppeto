<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    protected $fillable = [
        'factura_id',
        'articulo_id',
        'cantidad',
        'fecha_entrega',
        'observaciones',
    ];

    protected $casts = [
        'fecha_entrega' => 'date',
    ];

    public function factura()
    {
        return $this->belongsTo(Factura::class);
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class);
    }
}
