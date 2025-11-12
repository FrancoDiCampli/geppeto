<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EntregaController extends Controller
{
    public function create(Factura $factura)
    {
        return Inertia::render('Entregas/Create', [
            'factura' => $factura->load(['cliente', 'articulos', 'entregas']),
        ]);
    }

    public function store(Request $request, Factura $factura)
    {
        $request->validate([
            'entregas' => 'required|array|min:1',
            'entregas.*.articulo_id' => 'required|exists:articulos,id',
            'entregas.*.cantidad' => 'required|integer|min:1',
            'fecha_entrega' => 'required|date',
            'observaciones' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $factura) {
            foreach ($request->entregas as $entregaData) {
                // Crear entrega
                Entrega::create([
                    'factura_id' => $factura->id,
                    'articulo_id' => $entregaData['articulo_id'],
                    'cantidad' => $entregaData['cantidad'],
                    'fecha_entrega' => $request->fecha_entrega,
                    'observaciones' => $request->observaciones,
                ]);

                // Descontar del inventario
                $inventario = \App\Models\Inventario::where('articulo_id', $entregaData['articulo_id'])->first();
                if ($inventario) {
                    $inventario->decrement('cantidad', $entregaData['cantidad']);
                }
            }
        });

        return redirect()->route('ventas.index')
                        ->with('success', 'Entrega registrada exitosamente');
    }

    public function destroy(Entrega $entrega)
    {
        DB::transaction(function () use ($entrega) {
            // Restaurar inventario
            $inventario = \App\Models\Inventario::where('articulo_id', $entrega->articulo_id)->first();
            if ($inventario) {
                $inventario->increment('cantidad', $entrega->cantidad);
            }

            // Eliminar entrega
            $entrega->delete();
        });

        return redirect()->route('ventas.index')
                        ->with('success', 'Entrega eliminada exitosamente');
    }
}
