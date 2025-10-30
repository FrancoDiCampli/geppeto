#!/bin/bash
# Make sure this file has executable permissions, run `chmod +x build-app.sh`

# Exit the script if any command fails
set -e

php artisan migrate --force
# php artisan db:seed --force
php artisan storage:link
