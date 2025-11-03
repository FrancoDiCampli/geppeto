<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DashboardVentasDiariasSheet implements FromArray, WithTitle, WithHeadings
{
    protected $ventas;

    public function __construct($ventas)
    {
        $this->ventas = $ventas;
    }

    public function array(): array
    {
        return collect($this->ventas)->map(function ($venta) {
            return [
                $venta->dia,
                '$' . number_format($venta->total_dia, 2)
            ];
        })->toArray();
    }

    public function headings(): array
    {
        return ['Fecha', 'Total Ventas'];
    }

    public function title(): string
    {
        return 'Ventas Diarias';
    }
}