<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticuloImagen extends Model
{
    protected $table = 'articulo_imagenes';
    
    protected $fillable = [
        'articulo_id',
        'nombre_archivo',
        'ruta',
        'es_principal',
        'orden'
    ];

    protected $casts = [
        'es_principal' => 'boolean'
    ];

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->ruta);
    }

    protected $appends = ['url'];
}