<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticuloRemito extends Model
{
    protected $table = 'articulo_remito';

    protected $fillable = [
        'codprov',
        'codarticulo',
        'articulo',
        'medida',
        'cantidad',
        'bonificacion',
        'alicuota',
        'preciounitario',
        'subtotal',
        'lote',
        'articulo_id',
        'remito_id',
    ];

    public function remito()
    {
        return $this->belongsTo(Remito::class);
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class);
    }
}