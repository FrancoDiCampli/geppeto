<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\InitialSetting;
use Barryvdh\DomPDF\Facade\Pdf;

class FacturaPdfController extends Controller
{
    public function generate(Factura $factura)
    {
        if (!$factura->cae) {
            return redirect()->back()->with('error', 'La factura debe estar autorizada por AFIP');
        }

        $empresa = InitialSetting::first();
        
        $pdf = Pdf::loadView('pdf.factura', [
            'factura' => $factura->load(['cliente', 'articulos']),
            'empresa' => $empresa
        ]);

        return $pdf->download("factura-{$factura->numfactura}.pdf");
    }
}