<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\ArticuloImagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticuloImagenController extends Controller
{
    public function store(Request $request, Articulo $articulo)
    {
        $request->validate([
            'imagenes.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagenes = [];
        
        foreach ($request->file('imagenes') as $index => $imagen) {
            $nombreArchivo = time() . '_' . $index . '.' . $imagen->getClientOriginalExtension();
            $ruta = $imagen->storeAs('articulos/' . $articulo->id, $nombreArchivo, 'public');
            
            $articuloImagen = ArticuloImagen::create([
                'articulo_id' => $articulo->id,
                'nombre_archivo' => $nombreArchivo,
                'ruta' => $ruta,
                'es_principal' => $index === 0 && $articulo->imagenes()->count() === 0,
                'orden' => $articulo->imagenes()->count() + $index
            ]);
            
            $imagenes[] = $articuloImagen;
        }

        return response()->json(['imagenes' => $imagenes]);
    }

    public function destroy(ArticuloImagen $imagen)
    {
        Storage::disk('public')->delete($imagen->ruta);
        $imagen->delete();
        
        return response()->json(['success' => true]);
    }

    public function setPrincipal(ArticuloImagen $imagen)
    {
        // Quitar principal de todas las imágenes del artículo
        ArticuloImagen::where('articulo_id', $imagen->articulo_id)
                     ->update(['es_principal' => false]);
        
        // Establecer como principal
        $imagen->update(['es_principal' => true]);
        
        return response()->json(['success' => true]);
    }

    public function updateOrder(Request $request, Articulo $articulo)
    {
        $request->validate([
            'imagenes' => 'required|array',
            'imagenes.*.id' => 'required|exists:articulo_imagenes,id',
            'imagenes.*.orden' => 'required|integer'
        ]);

        foreach ($request->imagenes as $imagenData) {
            ArticuloImagen::where('id', $imagenData['id'])
                         ->update(['orden' => $imagenData['orden']]);
        }

        return response()->json(['success' => true]);
    }
}