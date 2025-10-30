<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Estado de Cuenta - {{ $cliente->razonsocial }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .cliente-info { margin-bottom: 20px; }
        .resumen { margin-bottom: 30px; }
        .resumen table { width: 100%; border-collapse: collapse; }
        .resumen th, .resumen td { border: 1px solid #ddd; padding: 8px; text-align: right; }
        .resumen th { background-color: #f5f5f5; }
        .facturas table { width: 100%; border-collapse: collapse; }
        .facturas th, .facturas td { border: 1px solid #ddd; padding: 6px; }
        .facturas th { background-color: #f5f5f5; text-align: center; }
        .pendiente { color: #dc3545; }
        .pagada { color: #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Estado de Cuenta</h1>
        <h2>{{ $cliente->razonsocial }}</h2>
    </div>

    <div class="cliente-info">
        <p><strong>Documento:</strong> {{ $cliente->documentounico }}</p>
        <p><strong>Email:</strong> {{ $cliente->email }}</p>
        <p><strong>Teléfono:</strong> {{ $cliente->telefono }}</p>
    </div>

    <div class="resumen">
        <h3>Resumen</h3>
        <table>
            <tr>
                <th>Total Compras</th>
                <th>Total Pagado</th>
                <th>Saldo Pendiente</th>
            </tr>
            <tr>
                <td>${{ number_format($resumen['total_compras'], 2) }}</td>
                <td>${{ number_format($resumen['total_pagado'], 2) }}</td>
                <td class="{{ $resumen['saldo_pendiente'] > 0 ? 'pendiente' : 'pagada' }}">
                    ${{ number_format($resumen['saldo_pendiente'], 2) }}
                </td>
            </tr>
        </table>
    </div>

    <div class="facturas">
        <h3>Historial de Compras</h3>
        <table>
            <thead>
                <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Pagado</th>
                    <th>Saldo</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($facturas as $factura)
                    @php
                        $totalPagado = $factura->pagos->sum('monto');
                        $saldoPendiente = $factura->total - $totalPagado;
                    @endphp
                    <tr>
                        <td>{{ $factura->numfactura }}</td>
                        <td>{{ date('d/m/Y', strtotime($factura->fecha)) }}</td>
                        <td>${{ number_format($factura->total, 2) }}</td>
                        <td>${{ number_format($totalPagado, 2) }}</td>
                        <td class="{{ $saldoPendiente > 0 ? 'pendiente' : 'pagada' }}">
                            ${{ number_format($saldoPendiente, 2) }}
                        </td>
                        <td>{{ $saldoPendiente > 0 ? 'Pendiente' : 'Pagada' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>