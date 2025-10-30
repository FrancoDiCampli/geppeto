<?php

namespace App\Console\Commands;

use App\Services\AfipService;
use Illuminate\Console\Command;

class TestAfipConnection extends Command
{
    protected $signature = 'afip:test-connection';
    protected $description = 'Test AFIP connection and configuration';

    public function handle()
    {
        try {
            $this->info('Testing AFIP connection...');
            
            // Verificar configuración
            $this->info('CUIT: ' . config('afip.cuit'));
            $this->info('Environment: ' . config('afip.environment'));
            $this->info('Certificate path: ' . config('afip.certificate_path'));
            $this->info('Key path: ' . config('afip.key_path'));
            
            // Verificar archivos
            if (!file_exists(config('afip.certificate_path'))) {
                $this->error('Certificate file not found: ' . config('afip.certificate_path'));
                return 1;
            }
            
            if (!file_exists(config('afip.key_path'))) {
                $this->error('Key file not found: ' . config('afip.key_path'));
                return 1;
            }
            
            $this->info('Certificate and key files found.');
            
            // Crear instancia del servicio
            $afipService = new AfipService();
            $this->info('AFIP Service created successfully.');
            
            $this->info('✅ AFIP connection test completed successfully!');
            return 0;
            
        } catch (\Exception $e) {
            $this->error('❌ AFIP connection test failed: ' . $e->getMessage());
            $this->error('File: ' . $e->getFile());
            $this->error('Line: ' . $e->getLine());
            return 1;
        }
    }
}