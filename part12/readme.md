# Tarea 12 — Dockerización de una app con frontend y backend

Creación de imágenes Docker para una aplicación compuesta por una carpeta `frontend` y una carpeta `backend`, orquestadas con Docker Compose.

## Estructura del proyecto

```
.
├── backend/
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

- Cada carpeta (`frontend` y `backend`) tiene su propio **Dockerfile**.
- En la raíz se agrega el **docker-compose.yml**.
- El archivo **nginx.conf** va dentro de la carpeta `frontend` (corrección respecto a la primera versión, donde estaba en la raíz).

## Puesta en marcha

1. Abrir **Docker Desktop**.
2. Construir y levantar los contenedores:

```bash
docker compose up --build
```

## Solución de problemas

Durante la primera ejecución aparecieron errores. Se resolvieron limpiando el entorno y reconstruyendo desde cero, sin usar caché:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d --remove-orphans
```

Qué hace cada comando:

| Comando | Descripción |
|---|---|
| `docker compose down -v` | Detiene los contenedores y elimina los volúmenes asociados |
| `docker compose build --no-cache` | Reconstruye las imágenes ignorando la caché |
| `docker compose up -d --remove-orphans` | Levanta los servicios en segundo plano y elimina contenedores huérfanos |

Con esto se lograron crear correctamente las imágenes de **backend** y **frontend**, visibles en Docker Desktop.

## Verificación

Abrir en el navegador:

```
http://localhost:8080
```

La aplicación se muestra y funciona correctamente.

## Detener los contenedores

```bash
docker compose down
```

## Nota

La aplicación utilizada no es de mi autoría; el trabajo de esta tarea consistió en su dockerización y despliegue local.
