<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Factura;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Fechas por defecto
        $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth()->format('Y-m-d'));

        // Convertir a rangos completos de fecha
        $fechaInicioCompleta = Carbon::parse($fechaInicio)->startOfDay();
        $fechaFinCompleta = Carbon::parse($fechaFin)->endOfDay();

        // Total de ventas acumulado
        $totalVentas = Factura::whereDate('fecha', '>=', $fechaInicio)
            ->whereDate('fecha', '<=', $fechaFin)
            ->sum('total');
        // Clientes nuevos en el período
        $clientesNuevos = Cliente::whereDate('created_at', '>=', $fechaInicio)
            ->whereDate('created_at', '<=', $fechaFin)
            ->count();

        // Importe total de ventas del período filtrado
        $ventasDelMes = Factura::whereDate('fecha', '>=', $fechaInicio)
            ->whereDate('fecha', '<=', $fechaFin)
            ->sum('total');

        // Saldo de ventas impagas
        $saldoImpagas = Factura::whereDate('fecha', '>=', $fechaInicio)
            ->whereDate('fecha', '<=', $fechaFin)
            ->where('pagada', 'NO')
            ->sum('total');

        // Ranking de productos más vendidos
        $productosVendidos = DB::table('articulo_factura')
            ->join('articulos', 'articulo_factura.articulo_id', '=', 'articulos.id')
            ->join('facturas', 'articulo_factura.factura_id', '=', 'facturas.id')
            ->whereDate('facturas.fecha', '>=', $fechaInicio)
            ->whereDate('facturas.fecha', '<=', $fechaFin)
            ->select('articulos.articulo', DB::raw('SUM(articulo_factura.cantidad) as total_vendido'))
            ->groupBy('articulos.id', 'articulos.articulo')
            ->orderBy('total_vendido', 'desc')
            ->limit(5)
            ->get();

        // Gráfico de ventas por día
        $ventasPorDia = Factura::whereDate('fecha', '>=', $fechaInicio)
            ->whereDate('fecha', '<=', $fechaFin)
            ->select(DB::raw('DATE(fecha) as dia'), DB::raw('SUM(total) as total_dia'))
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        // Ventas por vendedor
        $ventasPorVendedor = Factura::join('users', 'facturas.user_id', '=', 'users.id')
            ->whereDate('facturas.fecha', '>=', $fechaInicio)
            ->whereDate('facturas.fecha', '<=', $fechaFin)
            ->select('users.name', DB::raw('COUNT(*) as total_ventas'), DB::raw('SUM(facturas.total) as monto_total'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('monto_total', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'totalVentas' => $totalVentas,
            'clientesNuevos' => $clientesNuevos,
            'ventasDelMes' => $ventasDelMes,
            'saldoImpagas' => $saldoImpagas,
            'productosVendidos' => $productosVendidos,
            'ventasPorDia' => $ventasPorDia,
            'ventasPorVendedor' => $ventasPorVendedor,
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
        ]);
    }
}
