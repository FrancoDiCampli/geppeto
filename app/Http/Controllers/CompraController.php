<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Supplier;
use App\Models\Articulo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompraController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/Index', [
            'compras' => Compra::with(['supplier', 'detalles'])->orderBy('fecha', 'desc')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Compras/Create', [
            'suppliers' => Supplier::all(),
            'articulos' => Articulo::with(['categoria', 'marca'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'numero_remito' => 'required|string|max:255',
            'fecha' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.articulo_id' => 'required|exists:articulos,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        $compra = Compra::create([
            'numero_remito' => $request->numero_remito,
            'fecha' => $request->fecha,
            'supplier_id' => $request->supplier_id,
            'observaciones' => $request->observaciones,
            'subtotal' => 0,
            'total' => 0,
        ]);

        $subtotal = 0;
        foreach ($request->detalles as $detalle) {
            $subtotalDetalle = $detalle['cantidad'] * $detalle['precio_unitario'];
            $compra->detalles()->create([
                'articulo_id' => $detalle['articulo_id'],
                'cantidad' => $detalle['cantidad'],
                'precio_unitario' => $detalle['precio_unitario'],
                'subtotal' => $subtotalDetalle,
            ]);
            $subtotal += $subtotalDetalle;
        }

        $compra->update([
            'subtotal' => $subtotal,
            'total' => $subtotal,
        ]);

        return redirect()->route('compras.index')->with('success', 'Compra registrada exitosamente');
    }

    public function show(Compra $compra)
    {
        return Inertia::render('Compras/Show', [
            'compra' => $compra->load(['supplier', 'detalles.articulo']),
        ]);
    }

    public function edit(Compra $compra)
    {
        return Inertia::render('Compras/Edit', [
            'compra' => $compra->load(['supplier', 'detalles.articulo']),
            'suppliers' => Supplier::all(),
            'articulos' => Articulo::with(['categoria', 'marca'])->get(),
        ]);
    }

    public function update(Request $request, Compra $compra)
    {
        $request->validate([
            'numero_remito' => 'required|string|max:255',
            'fecha' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.articulo_id' => 'required|exists:articulos,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        $compra->update([
            'numero_remito' => $request->numero_remito,
            'fecha' => $request->fecha,
            'supplier_id' => $request->supplier_id,
            'observaciones' => $request->observaciones,
        ]);

        $compra->detalles()->delete();

        $subtotal = 0;
        foreach ($request->detalles as $detalle) {
            $subtotalDetalle = $detalle['cantidad'] * $detalle['precio_unitario'];
            $compra->detalles()->create([
                'articulo_id' => $detalle['articulo_id'],
                'cantidad' => $detalle['cantidad'],
                'precio_unitario' => $detalle['precio_unitario'],
                'subtotal' => $subtotalDetalle,
            ]);
            $subtotal += $subtotalDetalle;
        }

        $compra->update([
            'subtotal' => $subtotal,
            'total' => $subtotal,
        ]);

        return redirect()->route('compras.index')->with('success', 'Compra actualizada exitosamente');
    }

    public function destroy(Compra $compra)
    {
        $compra->delete();
        return redirect()->route('compras.index')->with('success', 'Compra eliminada exitosamente');
    }
}