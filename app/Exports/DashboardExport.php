<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DashboardExport implements WithMultipleSheets
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function sheets(): array
    {
        return [
            new DashboardResumenSheet($this->data),
            new DashboardProductosSheet($this->data['productosVendidos']),
            new DashboardVendedoresSheet($this->data['ventasPorVendedor']),
            new DashboardVentasDiariasSheet($this->data['ventasPorDia']),
        ];
    }
}