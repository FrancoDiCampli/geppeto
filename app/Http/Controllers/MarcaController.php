<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarcaController extends Controller
{
    public function index()
    {
        return Inertia::render('Marcas/Index', [
            'marcas' => Marca::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Marcas/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'marca' => 'required|string|max:255',
        ]);

        Marca::create($request->all());

        return redirect()->route('marcas.index')->with('success', 'Marca creada exitosamente');
    }

    public function edit(Marca $marca)
    {
        return Inertia::render('Marcas/Edit', [
            'marca' => $marca,
        ]);
    }

    public function update(Request $request, Marca $marca)
    {
        $request->validate([
            'marca' => 'required|string|max:255',
        ]);

        $marca->update($request->all());

        return redirect()->route('marcas.index')->with('success', 'Marca actualizada exitosamente');
    }

    public function destroy(Marca $marca)
    {
        $marca->delete();

        return redirect()->route('marcas.index')->with('success', 'Marca eliminada exitosamente');
    }
}
