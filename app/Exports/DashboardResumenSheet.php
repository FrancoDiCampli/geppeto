<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DashboardResumenSheet implements FromArray, WithTitle, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        return [
            ['Total Ventas Acumulado', '$' . number_format($this->data['totalVentas'], 2)],
            ['Clientes Nuevos', $this->data['clientesNuevos']],
            ['Ventas del Mes', '$' . number_format($this->data['ventasDelMes'], 2)],
            ['Saldo Impagas', '$' . number_format($this->data['saldoImpagas'], 2)],
        ];
    }

    public function headings(): array
    {
        return ['Métrica', 'Valor'];
    }

    public function title(): string
    {
        return 'Resumen';
    }
}