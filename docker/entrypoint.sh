#!/bin/sh

while ! nc -z ${DB_HOST:-mysql} ${DB_PORT:-3306}; do
    sleep 1
done

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force
fi

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    php artisan db:seed --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

mkdir -p /var/log/supervisor
mkdir -p /var/log/nginx

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf