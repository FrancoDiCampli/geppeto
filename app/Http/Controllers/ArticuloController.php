<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticuloController extends Controller
{
    public function index(Request $request)
    {
        $query = Articulo::with(['categoria', 'marca', 'supplier']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('codarticulo', 'like', '%' . $request->search . '%')
                  ->orWhere('articulo', 'like', '%' . $request->search . '%')
                  ->orWhere('descripcion', 'like', '%' . $request->search . '%');
            });
        }
        
        return Inertia::render('Articulos/Index', [
            'articulos' => $query->paginate(5)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Articulos/Create', [
            'categorias' => Categoria::all(),
            'marcas' => Marca::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'codarticulo' => 'required|string|max:255',
            'articulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'medida' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'alicuota' => 'required|numeric|min:0',
            'stockminimo' => 'required|integer|min:0',
            'marca_id' => 'required|exists:marcas,id',
            'categoria_id' => 'required|exists:categorias,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'imagenes.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $articulo = Articulo::create($request->except('imagenes'));

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $index => $imagen) {
                $nombreArchivo = time() . '_' . $index . '.' . $imagen->getClientOriginalExtension();
                $ruta = $imagen->storeAs('articulos/' . $articulo->id, $nombreArchivo, 'public');
                
                $articulo->imagenes()->create([
                    'nombre_archivo' => $nombreArchivo,
                    'ruta' => $ruta,
                    'es_principal' => $index === 0,
                    'orden' => $index
                ]);
            }
        }

        return redirect()->route('articulos.index')->with('success', 'Artículo creado exitosamente');
    }

    public function edit(Articulo $articulo)
    {
        return Inertia::render('Articulos/Edit', [
            'articulo' => $articulo->load(['imagenes', 'supplier']),
            'categorias' => Categoria::all(),
            'marcas' => Marca::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    public function update(Request $request, Articulo $articulo)
    {
        $request->validate([
            'codarticulo' => 'required|string|max:255',
            'articulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'medida' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'alicuota' => 'required|numeric|min:0',
            'stockminimo' => 'required|integer|min:0',
            'marca_id' => 'required|exists:marcas,id',
            'categoria_id' => 'required|exists:categorias,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'imagenes.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $articulo->update($request->except('imagenes'));

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $index => $imagen) {
                $nombreArchivo = time() . '_' . $index . '.' . $imagen->getClientOriginalExtension();
                $ruta = $imagen->storeAs('articulos/' . $articulo->id, $nombreArchivo, 'public');
                
                $articulo->imagenes()->create([
                    'nombre_archivo' => $nombreArchivo,
                    'ruta' => $ruta,
                    'es_principal' => $articulo->imagenes()->count() === 0 && $index === 0,
                    'orden' => $articulo->imagenes()->count() + $index
                ]);
            }
        }

        return redirect()->route('articulos.index')->with('success', 'Artículo actualizado exitosamente');
    }

    public function destroy(Articulo $articulo)
    {
        $articulo->delete();

        return redirect()->route('articulos.index')->with('success', 'Artículo eliminado exitosamente');
    }
}