# 🐳 Guía de Despliegue Docker - Gepetto

Esta guía te permitirá desplegar la aplicación Gepetto usando Docker de manera rápida y sencilla.

## 📋 Requisitos Previos

- **Docker** 20.10+ instalado
- **Docker Compose** 2.0+ instalado
- **Git** para clonar el repositorio
- Al menos **2GB RAM** disponible
- **5GB** de espacio en disco

### Verificar instalación
```bash
docker --version
docker-compose --version
```

---

## 🚀 Despliegue Rápido (5 minutos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/FrancoDiCampli/geppeto.git
cd geppeto
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de configuración
cp .env.docker .env

# Editar configuración (opcional)
nano .env
```

### 3. Construir y ejecutar
```bash
# Construir imágenes y ejecutar servicios
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f app
```

### 4. Acceder a la aplicación
- **URL**: http://localhost
- **Usuario**: admin@gepetto.com
- **Password**: password

---

## 🔧 Configuración Detallada

### Estructura de Archivos Docker
```
gepetto/
├── Dockerfile                 # Imagen principal de la aplicación
├── docker-compose.yml        # Orquestación de servicios
├── .dockerignore             # Archivos excluidos del build
├── .env.docker               # Variables de entorno para Docker
└── docker/
    ├── nginx.conf            # Configuración Nginx
    ├── php.ini               # Configuración PHP
    ├── supervisord.conf      # Supervisor para procesos
    ├── mysql.cnf             # Configuración MySQL
    └── entrypoint.sh         # Script de inicialización
```

### Servicios Incluidos

#### 🌐 **App (Aplicación Principal)**
- **Imagen**: PHP 8.4 + Nginx + Supervisor
- **Puerto**: 80
- **Características**:
  - Laravel optimizado para producción
  - Assets compilados con Vite
  - OPcache habilitado
  - Logs centralizados

#### 🗄️ **MySQL 8.0**
- **Puerto**: 3306
- **Base de datos**: gepetto_db
- **Usuario**: gepetto_user
- **Configuración optimizada** para Laravel

#### 🔴 **Redis**
- **Puerto**: 6379
- **Uso**: Cache y sesiones
- **Persistencia**: Habilitada

---

## ⚙️ Variables de Entorno

### Configuración de Base de Datos
```env
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=gepetto_db
DB_USERNAME=gepetto_user
DB_PASSWORD=gepetto_password
```

### Configuración AFIP
```env
AFIP_CUIT=20349590418
AFIP_ENVIRONMENT=homologacion
AFIP_CERTIFICATE_PATH=storage/app/private/afip/cert.pem
AFIP_KEY_PATH=storage/app/private/afip/key.pem
```

### Configuración de Aplicación
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://tu-dominio.com
```

---

## 🛠️ Comandos Útiles

### Gestión de Contenedores
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f [servicio]
```

### Comandos de Laravel
```bash
# Ejecutar migraciones
docker-compose exec app php artisan migrate

# Ejecutar seeders
docker-compose exec app php artisan db:seed

# Limpiar cache
docker-compose exec app php artisan cache:clear

# Generar clave de aplicación
docker-compose exec app php artisan key:generate

# Acceder al contenedor
docker-compose exec app sh
```

### Base de Datos
```bash
# Conectar a MySQL
docker-compose exec mysql mysql -u gepetto_user -p gepetto_db

# Backup de base de datos
docker-compose exec mysql mysqldump -u gepetto_user -p gepetto_db > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u gepetto_user -p gepetto_db < backup.sql
```

---

## 📁 Volúmenes y Persistencia

### Volúmenes Configurados
```yaml
volumes:
  - ./storage:/var/www/html/storage          # Archivos de la aplicación
  - ./bootstrap/cache:/var/www/html/bootstrap/cache  # Cache de Laravel
  - afip_certs:/var/www/html/storage/app/private/afip  # Certificados AFIP
  - mysql_data:/var/lib/mysql                # Datos de MySQL
  - redis_data:/data                         # Datos de Redis
```

### Backup de Volúmenes
```bash
# Backup completo
docker run --rm -v gepetto_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .

# Restaurar backup
docker run --rm -v gepetto_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql_backup.tar.gz -C /data
```

---

## 🔒 Configuración de Certificados AFIP

### 1. Copiar certificados al volumen
```bash
# Crear directorio temporal
mkdir -p temp_afip

# Copiar tus certificados
cp cert.pem temp_afip/
cp key.pem temp_afip/

# Copiar al volumen Docker
docker run --rm -v gepetto_afip_certs:/afip -v $(pwd)/temp_afip:/temp alpine cp -r /temp/* /afip/

# Limpiar
rm -rf temp_afip
```

### 2. Verificar certificados
```bash
docker-compose exec app php artisan afip:check-certificates
```

---

## 🌐 Configuración para Producción

### 1. Configurar dominio
```bash
# Editar .env
APP_URL=https://tu-dominio.com
```

### 2. Configurar HTTPS con Nginx Proxy
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
    
  app:
    environment:
      - VIRTUAL_HOST=tu-dominio.com
      - LETSENCRYPT_HOST=tu-dominio.com
```

### 3. Usar archivo de producción
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoreo y Logs

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo aplicación
docker-compose logs -f app

# Solo base de datos
docker-compose logs -f mysql
```

### Métricas de contenedores
```bash
# Uso de recursos
docker stats

# Información detallada
docker-compose exec app df -h
docker-compose exec app free -m
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. **Error de conexión a base de datos**
```bash
# Verificar que MySQL esté ejecutándose
docker-compose ps mysql

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

#### 2. **Permisos de archivos**
```bash
# Corregir permisos
docker-compose exec app chown -R www-data:www-data /var/www/html/storage
docker-compose exec app chmod -R 775 /var/www/html/storage
```

#### 3. **Cache corrupto**
```bash
# Limpiar todos los caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

#### 4. **Problemas de memoria**
```bash
# Aumentar memoria en docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Logs de Depuración
```bash
# Logs de aplicación Laravel
docker-compose exec app tail -f storage/logs/laravel.log

# Logs de Nginx
docker-compose exec app tail -f /var/log/nginx/error.log

# Logs de PHP
docker-compose exec app tail -f /var/log/php_errors.log
```

---

## 🚀 Despliegue en Servidor

### 1. Preparar servidor
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clonar y configurar
```bash
git clone https://github.com/FrancoDiCampli/geppeto.git
cd geppeto
cp .env.docker .env

# Editar configuración para producción
nano .env
```

### 3. Ejecutar
```bash
docker-compose up -d --build
```

### 4. Configurar firewall
```bash
# Ubuntu/Debian
sudo ufw allow 80
sudo ufw allow 443

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

---

## 📈 Optimización de Performance

### 1. Configuración de producción
```yaml
# docker-compose.override.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### 2. Optimizaciones PHP
```ini
# docker/php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=10000
opcache.revalidate_freq=0
```

### 3. Optimizaciones MySQL
```cnf
# docker/mysql.cnf
innodb_buffer_pool_size=512M
query_cache_size=64M
max_connections=500
```

---

## 🔄 Actualizaciones

### Actualizar aplicación
```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull origin main

# Reconstruir y ejecutar
docker-compose up -d --build

# Ejecutar migraciones si es necesario
docker-compose exec app php artisan migrate --force
```

### Actualizar imágenes base
```bash
# Actualizar imágenes
docker-compose pull

# Reconstruir
docker-compose up -d --build --force-recreate
```

---

## 💾 Backup y Restauración

### Script de backup automático
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

# Backup base de datos
docker-compose exec -T mysql mysqldump -u gepetto_user -pgepetto_password gepetto_db > $BACKUP_DIR/db_$DATE.sql

# Backup archivos
docker run --rm -v gepetto_mysql_data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/volumes_$DATE.tar.gz -C /data .

echo "Backup completado: $DATE"
```

### Programar backups
```bash
# Agregar a crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 📞 Soporte

### Información del sistema
```bash
# Versiones
docker --version
docker-compose --version

# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats --no-stream
```

### Logs para soporte
```bash
# Generar reporte completo
docker-compose logs > gepetto_logs.txt
docker-compose ps > gepetto_status.txt
```

---

**¡Gepetto dockerizado y listo para producción!** 🎉

Para soporte adicional, consulta la documentación del proyecto o crea un issue en el repositorio.