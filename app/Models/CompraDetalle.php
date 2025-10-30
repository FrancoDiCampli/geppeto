<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraDetalle extends Model
{
    protected $fillable = [
        'compra_id',
        'articulo_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class);
    }
}