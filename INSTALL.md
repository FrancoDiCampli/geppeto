# Instalación Gepetto

## Requisitos
- Docker
- Docker Compose
- Git

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/gepetto.git
cd gepetto

# Construir y levantar contenedores
docker-compose up -d --build

# Generar clave de aplicación
docker exec gepetto-app php artisan key:generate

# Ejecutar migraciones y seeders
docker exec gepetto-app php artisan migrate --seed

# Limpiar cache
docker exec gepetto-app php artisan config:clear
docker exec gepetto-app php artisan cache:clear
```

## Acceso

**URL**: http://localhost:3000

**Credenciales por defecto**:
- Usuario: admin@gepetto.com
- Contraseña: password

## Comandos útiles

```bash
# Ver logs
docker logs gepetto-app

# Detener contenedores
docker-compose down

# Reiniciar contenedores
docker-compose restart

# Acceder al contenedor
docker exec -it gepetto-app bash
```