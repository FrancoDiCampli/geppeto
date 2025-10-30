<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $fillable = [
        'cantidad',
        'lote',
        'vencimiento',
        'articulo_id',
        'supplier_id',
    ];

    protected $casts = [
        'vencimiento' => 'date',
    ];

    public function articulo()
    {
        return $this->belongsTo(Articulo::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
