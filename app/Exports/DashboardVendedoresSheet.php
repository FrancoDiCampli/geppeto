<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DashboardVendedoresSheet implements FromArray, WithTitle, WithHeadings
{
    protected $vendedores;

    public function __construct($vendedores)
    {
        $this->vendedores = $vendedores;
    }

    public function array(): array
    {
        return collect($this->vendedores)->map(function ($vendedor) {
            return [
                $vendedor->name,
                $vendedor->total_ventas,
                '$' . number_format($vendedor->monto_total, 2)
            ];
        })->toArray();
    }

    public function headings(): array
    {
        return ['Vendedor', 'Cantidad Ventas', 'Monto Total'];
    }

    public function title(): string
    {
        return 'Ventas por Vendedor';
    }
}