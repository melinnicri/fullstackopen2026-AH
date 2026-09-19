# Tarea 12: Dockerización de una aplicación Full Stack
2
 
3
## Objetivo
4
 
5
Crear imágenes Docker para una aplicación compuesta por dos proyectos:
6
 
7
- `frontend`
8
- `backend`
9
 
10
## Estructura del proyecto
11
 
12
Para ello se crearon los siguientes archivos:
13
 
14
### Carpeta `frontend`
15
- `Dockerfile`
16
- `nginx.conf`
17
 
18
### Carpeta `backend`
19
- `Dockerfile`
20
 
21
### Carpeta raíz
22
- `docker-compose.yml`
23
 
24
> Corrección realizada: el archivo `nginx.conf` debe ubicarse dentro de la carpeta `frontend`.
25
 
26
## Levantar los contenedores
27
 
28
Con Docker Desktop en ejecución, se construyó y levantó la aplicación mediante:
29
 
30

Resolución de problemas

Durante el proceso surgieron algunos errores de configuración. Para solucionar el problema se ejecutaron los siguientes comandos:

Shell
1
docker compose down -v
2
docker compose build --no-cache
3
docker compose up -d --remove-orphans
Mostrar más líneas

Tras aplicar estas acciones, se logró generar correctamente las imágenes de frontend y backend, visibles en Docker Desktop.

Verificación

La aplicación quedó disponible localmente en:

http://localhost:8080

Al acceder a la URL, la aplicación se ejecuta correctamente y responde de forma esperada.

Detener los contenedores

Para apagar y eliminar los contenedores en ejecución:

Shell
1
docker compose down

Resultado

✅ Se crearon correctamente las imágenes Docker para el backend y el frontend.

✅ La aplicación quedó operativa mediante Docker Compose.

✅ Se verificó el funcionamiento de la aplicación a través de localhost:8080.


Queda con aspecto de documentación técnica para GitHub y portafolio, mostrando tanto el objetivo como los problemas que resolviste durante el proceso.```bash
31
docker compose up --build
