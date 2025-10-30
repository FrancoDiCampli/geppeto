<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $fillable = [
        'marca',
    ];

    public function articulos()
    {
        return $this->hasMany(Articulo::class);
    }
}
