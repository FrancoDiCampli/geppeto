<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Factura;
use App\Models\Cliente;
use App\Models\Articulo;
use App\Models\User;
use Carbon\Carbon;

class VentasSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = Cliente::all();
        $articulos = Articulo::all();
        $users = User::all();

        if ($clientes->isEmpty() || $articulos->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No hay clientes, artículos o usuarios. Ejecuta primero los seeders correspondientes.');
            return;
        }

        $meses = [
            ['mes' => 9, 'año' => 2025], // Septiembre
            ['mes' => 10, 'año' => 2025], // Octubre
        ];

        foreach ($meses as $periodo) {
            foreach ($users as $user) {
                // 5 ventas por usuario por mes
                for ($i = 1; $i <= 5; $i++) {
                    $fecha = Carbon::create($periodo['año'], $periodo['mes'], rand(1, 28));
                    $cliente = $clientes->random();
                    
                    // Seleccionar 1-5 artículos aleatorios
                    $articulosVenta = $articulos->random(rand(1, 5));
                    
                    $subtotal = 0;
                    $detalles = [];
                    
                    foreach ($articulosVenta as $articulo) {
                        $cantidad = rand(1, 10);
                        $precio = $articulo->precio * (1 + (rand(-20, 50) / 100)); // Variación de precio ±20% a +50%
                        $total = $cantidad * $precio;
                        $subtotal += $total;
                        
                        $detalles[] = [
                            'articulo_id' => $articulo->id,
                            'cantidad' => $cantidad,
                            'precio' => $precio,
                            'total' => $total,
                        ];
                    }
                    
                    // Calcular IVA según condición del cliente
                    $iva = 0;
                    if ($cliente->condicioniva === 'Responsable Inscripto') {
                        $iva = $subtotal * 0.21; // 21% IVA
                    }
                    
                    $total = $subtotal + $iva;
                    
                    // Determinar si está pagada (70% probabilidad)
                    $pagada = rand(1, 100) <= 70 ? 'SI' : 'NO';
                    
                    $factura = Factura::create([
                        'numfactura' => str_pad(Factura::count() + 1, 8, '0', STR_PAD_LEFT),
                        'fecha' => $fecha,
                        'cliente_id' => $cliente->id,
                        'user_id' => $user->id,
                        'cuit' => $cliente->documentounico,
                        'bonificacion' => 0,
                        'recargo' => 0,
                        'descuento' => 0,
                        'subtotal' => $subtotal,
                        'total' => $total,
                        'pagada' => $pagada,
                        'condicionventa' => 'Contado',
                        'cae' => $pagada === 'SI' ? 'CAE' . rand(10000000000000, 99999999999999) : null,
                        'vencimiento_cae' => $pagada === 'SI' ? $fecha->addDays(10) : null,
                        'letracomprobante' => $cliente->condicioniva === 'Responsable Inscripto' ? 'A' : 'B',
                        'codcomprobante' => '01', // Factura
                        'ptoventa' => '0001',
                        'created_at' => $fecha,
                        'updated_at' => $fecha,
                    ]);
                    
                    // Crear detalles de la factura usando la tabla pivot
                    foreach ($detalles as $detalle) {
                        $articulo = Articulo::find($detalle['articulo_id']);
                        $factura->articulos()->attach($detalle['articulo_id'], [
                            'codprov' => $articulo->codprov ?? '',
                            'codarticulo' => $articulo->codarticulo,
                            'articulo' => $articulo->articulo,
                            'medida' => $articulo->medida,
                            'cantidad' => $detalle['cantidad'],
                            'bonificacion' => 0,
                            'alicuota' => $articulo->alicuota,
                            'preciounitario' => $detalle['precio'],
                            'subtotal' => $detalle['total'],
                        ]);
                    }
                    
                    // Si está pagada, crear el pago
                    if ($pagada === 'SI') {
                        $factura->pagos()->create([
                            'monto' => $total,
                            'fecha_pago' => $fecha->addDays(rand(0, 15)), // Pago entre 0-15 días después
                            'metodo_pago' => collect(['efectivo', 'transferencia', 'cheque', 'tarjeta'])->random(),
                            'observaciones' => 'Pago completo',
                        ]);
                    }
                }
            }
        }
        
        $this->command->info('Se crearon ' . (count($meses) * $users->count() * 5) . ' ventas distribuidas en septiembre y octubre 2025.');
    }
}