# Verificación de Certificados AFIP

## Descripción

Sistema para verificar el estado de los certificados digitales AFIP en tu aplicación Laravel. Permite identificar certificados vencidos, próximos a vencer o con problemas de validez.

## Características

- ✅ Verificación automática del estado de certificados
- 📅 Detección de certificados vencidos o próximos a vencer
- 🔍 Análisis detallado de información del certificado
- 🖥️ Interfaz web intuitiva
- 📋 Comando de consola para verificación rápida

## Uso

### 1. Interfaz Web

Accede a la verificación de certificados desde el menú lateral:

```
AFIP > Certificados
```

O directamente en la URL:
```
/afip/certificates
```

### 2. Comando de Consola

Para verificar certificados desde la terminal:

```bash
php artisan afip:check-certificates
```

## Estados de Certificados

| Estado | Descripción | Color |
|--------|-------------|-------|
| ✅ Válido | Certificado válido con más de 30 días | Verde |
| ⚠️ Por vencer | Certificado válido pero vence en menos de 30 días | Naranja |
| ❌ Vencido | Certificado expirado | Rojo |
| ⏳ No válido aún | Certificado aún no válido | Amarillo |
| ❌ Inválido | Archivo no es un certificado válido | Gris |

## Ubicación de Certificados

Los certificados deben estar ubicados en:
```
storage/app/afip/
```

Formatos soportados:
- `.pem`
- `.crt` 
- `.cert`

## Información Mostrada

Para cada certificado válido se muestra:

- **Nombre del archivo**
- **Estado actual**
- **Sujeto del certificado**
- **Emisor**
- **Fecha de validez (desde/hasta)**
- **Días restantes hasta vencimiento**
- **Número de serie**
- **Tamaño del archivo**
- **Fecha de modificación**

## Solución de Problemas

### Error: "No se encontraron certificados"

1. Verifica que el directorio `storage/app/afip/` existe
2. Asegúrate de que los certificados tienen las extensiones correctas
3. Verifica los permisos del directorio

### Error: "No es un certificado válido"

1. Verifica que el archivo contiene `-----BEGIN CERTIFICATE-----`
2. Asegúrate de que el certificado no está corrupto
3. Verifica que es un certificado X.509 válido

### Certificados vencidos

Según los logs, tienes certificados vencidos. Para solucionarlo:

1. Contacta con AFIP para renovar los certificados
2. Descarga los nuevos certificados
3. Reemplaza los archivos en `storage/app/afip/`
4. Verifica nuevamente el estado

## Archivos Creados

- `app/Http/Controllers/AfipCertificateController.php` - Controlador principal
- `resources/js/pages/Afip/Certificates.tsx` - Vista React
- `app/Console/Commands/CheckAfipCertificates.php` - Comando de consola
- Ruta agregada en `routes/web.php`
- Enlace agregado en el sidebar de navegación

## Próximos Pasos

1. Renueva los certificados vencidos con AFIP
2. Configura alertas automáticas para certificados próximos a vencer
3. Considera automatizar la renovación de certificados