<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\Inventario;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventarioController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventarios/Index', [
            'inventarios' => Inventario::with(['articulo', 'supplier'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventarios/Create', [
            'articulos' => Articulo::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:0',
            'lote' => 'nullable|integer',
            'vencimiento' => 'nullable|date',
            'articulo_id' => 'required|exists:articulos,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        Inventario::create($request->all());

        return redirect()->route('inventarios.index')->with('success', 'Inventario creado exitosamente');
    }

    public function edit(Inventario $inventario)
    {
        return Inertia::render('Inventarios/Edit', [
            'inventario' => $inventario,
            'articulos' => Articulo::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    public function update(Request $request, Inventario $inventario)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:0',
            'lote' => 'nullable|integer',
            'vencimiento' => 'nullable|date',
            'articulo_id' => 'required|exists:articulos,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $inventario->update($request->all());

        return redirect()->route('inventarios.index')->with('success', 'Inventario actualizado exitosamente');
    }

    public function destroy(Inventario $inventario)
    {
        $inventario->delete();

        return redirect()->route('inventarios.index')->with('success', 'Inventario eliminado exitosamente');
    }
}
