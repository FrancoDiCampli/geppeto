<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        return Inertia::render('Suppliers/Index', [
            'suppliers' => Supplier::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'razonsocial' => 'required|string|max:255',
            'cuit' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email',
        ]);

        Supplier::create($request->all());

        return redirect()->route('suppliers.index')->with('success', 'Proveedor creado exitosamente');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'razonsocial' => 'required|string|max:255',
            'cuit' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email',
        ]);

        $supplier->update($request->all());

        return redirect()->route('suppliers.index')->with('success', 'Proveedor actualizado exitosamente');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index')->with('success', 'Proveedor eliminado exitosamente');
    }
}
