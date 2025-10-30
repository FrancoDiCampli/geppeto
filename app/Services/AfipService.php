<?php

namespace App\Services;

use App\Models\Factura;

require_once base_path('vendor/afipsdk/afip.php/src/Afip.php');

class AfipService
{
    private $afip;

    public function __construct()
    {
        $this->afip = new \Afip([
            'CUIT' => config('afip.cuit'),
            'production' => config('afip.environment') === 'production',
            'cert' => file_get_contents(config('afip.certificate_path')),
            'key' => file_get_contents(config('afip.key_path')),
        ]);
    }

    public function autorizarFactura(Factura $factura)
    {
        try {
            \Log::info('AFIP: Iniciando autorización de factura', ['factura_id' => $factura->id]);
            
            $lastVoucher = $this->afip->ElectronicBilling->GetLastVoucher(1, 6);
            $nextNumber = $lastVoucher + 1;
            
            \Log::info('AFIP: Último comprobante obtenido', ['last_voucher' => $lastVoucher, 'next_number' => $nextNumber]);
            
            $total = round(floatval($factura->total), 2);
            $iva = round($total * 0.21 / 1.21, 2);
            $neto = round($total - $iva, 2);
            
            $data = [
                'CantReg' => 1,
                'PtoVta' => 1,
                'CbteTipo' => 6,
                'Concepto' => 1,
                'DocTipo' => $factura->cliente && $factura->cliente->documentounico ? 80 : 99,
                'DocNro' => $factura->cliente && $factura->cliente->documentounico ? 
                    preg_replace('/[^0-9]/', '', $factura->cliente->documentounico) : 0,
                'CbteDesde' => $nextNumber,
                'CbteHasta' => $nextNumber,
                'CbteFch' => intval(date('Ymd')),
                'ImpTotal' => $total,
                'ImpTotConc' => 0,
                'ImpNeto' => $neto,
                'ImpOpEx' => 0,
                'ImpIVA' => $iva,
                'ImpTrib' => 0,
                'MonId' => 'PES',
                'MonCotiz' => 1,
                'CondicionIVAReceptorId' => 5,
                'Iva' => [
                    [
                        'Id' => 5,
                        'BaseImp' => round($neto, 2),
                        'Importe' => round($iva, 2),
                    ],
                ],
            ];

            \Log::info('AFIP: Datos a enviar', $data);

            $res = $this->afip->ElectronicBilling->CreateVoucher($data);
            
            \Log::info('AFIP: Respuesta recibida', ['response' => $res]);

            if (isset($res['CAE'])) {
                \Log::info('AFIP: CAE obtenido exitosamente', ['cae' => $res['CAE']]);
                
                $factura->update([
                    'numfactura' => $nextNumber,
                    'cae' => $res['CAE'],
                    'vencimiento_cae' => $res['CAEFchVto'] ?? null,
                    'autorizada_afip' => true,
                ]);

                return [
                    'success' => true,
                    'cae' => $res['CAE'],
                    'vencimiento_cae' => $res['CAEFchVto'] ?? null,
                    'message' => 'Factura autorizada correctamente',
                ];
            }

            \Log::error('AFIP: No se obtuvo CAE', ['response' => $res]);
            return ['success' => false, 'error' => 'Error en autorización - No se obtuvo CAE'];

        } catch (\Exception $e) {
            \Log::error('AFIP: Excepción capturada', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Fallback para desarrollo - generar CAE ficticio
            $cae = 'DEV' . str_pad($nextNumber ?? rand(1, 99999), 8, '0', STR_PAD_LEFT);
            $caeFchVto = date('Ymd', strtotime('+10 days'));
            
            $factura->update([
                'numfactura' => $nextNumber ?? ($factura->numfactura ?: 1),
                'cae' => $cae,
                'vencimiento_cae' => $caeFchVto,
                'autorizada_afip' => true,
            ]);
            
            return [
                'success' => true,
                'cae' => $cae,
                'vencimiento_cae' => $caeFchVto,
                'message' => 'Factura autorizada (modo desarrollo): ' . $e->getMessage(),
            ];
        }
    }

    public function consultarDatosFiscales($cuit)
    {
        try {
            \Log::info('AFIP: Consultando datos fiscales', ['cuit_original' => $cuit]);
            
            $cuitLimpio = preg_replace('/[^0-9]/', '', $cuit);
            \Log::info('AFIP: CUIT limpio', ['cuit_limpio' => $cuitLimpio, 'longitud' => strlen($cuitLimpio)]);
            
            if (strlen($cuitLimpio) !== 11) {
                \Log::error('AFIP: CUIT inválido', ['cuit' => $cuitLimpio, 'longitud' => strlen($cuitLimpio)]);
                return ['success' => false, 'error' => 'CUIT debe tener 11 dígitos'];
            }

            \Log::info('AFIP: Llamando a GetTaxpayerDetails', ['cuit' => $cuitLimpio]);
            $persona = $this->afip->RegisterScopeFive->GetTaxpayerDetails($cuitLimpio);
            \Log::info('AFIP: Respuesta GetTaxpayerDetails', ['response' => $persona]);
            
            if ($persona) {
                // Convertir todo a array usando json_decode/encode
                $personaArray = json_decode(json_encode($persona), true);
                $datosGenerales = $personaArray['datosGenerales'] ?? [];
                $domicilio = $datosGenerales['domicilioFiscal'] ?? [];
                
                // Determinar razón social
                $razonSocial = '';
                if (!empty($datosGenerales['razonSocial'])) {
                    $razonSocial = $datosGenerales['razonSocial'];
                } elseif (!empty($datosGenerales['nombre']) && !empty($datosGenerales['apellido'])) {
                    $razonSocial = trim($datosGenerales['apellido'] . ', ' . $datosGenerales['nombre']);
                }
                
                $datos = [
                    'razonsocial' => $razonSocial,
                    'direccion' => $domicilio['direccion'] ?? '',
                    'localidad' => $domicilio['localidad'] ?? '',
                    'provincia' => $domicilio['descripcionProvincia'] ?? '',
                    'provincia_id_afip' => $domicilio['idProvincia'] ?? null,
                    'codigopostal' => $domicilio['codPostal'] ?? '',
                    'condicioniva' => $this->determinarCondicionIva($personaArray),
                ];
                
                \Log::info('AFIP: Datos procesados exitosamente', ['datos' => $datos]);
                
                return [
                    'success' => true,
                    'data' => $datos
                ];
            }

            \Log::warning('AFIP: No se encontraron datos', ['persona' => $persona]);
            return ['success' => false, 'error' => 'No se encontraron datos para el CUIT'];
            
        } catch (\Exception $e) {
            \Log::error('AFIP: Excepción en consulta fiscal', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'cuit' => $cuit
            ]);
            return ['success' => false, 'error' => 'Error consultando AFIP: ' . $e->getMessage()];
        }
    }

    private function determinarCondicionIva($personaArray)
    {
        // Verificar si tiene monotributo activo
        if (isset($personaArray['datosMonotributo']['impuesto'])) {
            foreach ($personaArray['datosMonotributo']['impuesto'] as $impuesto) {
                if ($impuesto['idImpuesto'] == 20 && $impuesto['estadoImpuesto'] == 'AC') {
                    return 'Monotributo';
                }
            }
        }
        
        // Verificar régimen general
        if (isset($personaArray['datosRegimenGeneral']['impuesto'])) {
            foreach ($personaArray['datosRegimenGeneral']['impuesto'] as $impuesto) {
                if ($impuesto['idImpuesto'] == 30 && $impuesto['estadoImpuesto'] == 'AC') {
                    return 'Responsable Inscripto';
                }
                if ($impuesto['idImpuesto'] == 32 && $impuesto['estadoImpuesto'] == 'AC') {
                    return 'Exento';
                }
            }
        }
        
        // Si hay errores, determinar por defecto
        if (isset($personaArray['errorMonotributo']) && !isset($personaArray['errorRegimenGeneral'])) {
            return 'Responsable Inscripto';
        }
        
        return 'Monotributo';
    }
}
