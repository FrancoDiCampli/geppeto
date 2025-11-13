#!/bin/sh

# Esperar a que la base de datos esté disponible
echo "Esperando conexión a la base de datos..."
while ! nc -z ${DB_HOST:-mysql} ${DB_PORT:-3306}; do
    sleep 1
done
echo "Base de datos conectada!"

# Ejecutar migraciones si es necesario
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "Ejecutando migraciones..."
    php artisan migrate --force
fi

# Ejecutar seeders si es necesario
if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    echo "Ejecutando seeders..."
    php artisan db:seed --force
fi

# Limpiar y optimizar cache
echo "Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Crear directorios de logs si no existen
mkdir -p /var/log/supervisor
mkdir -p /var/log/nginx

# Iniciar supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf