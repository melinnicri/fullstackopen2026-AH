# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



---

# Tarea 3  
## Conceptos básicos de React: Procesamiento de formularios

- Desde esta parte 3, comenzaré a realizar el resto de las tareas dentro de esta carpeta y así no tener que replicar
- cada vez todas las dependencias de React (sería en src todas las tareas):

```
src/
  tarea3/
    App.jsx
    README.md
  tarea4/
    App.jsx
    README.md
  tarea5/
    App.jsx
    README.md
  main.jsx
```

En main.jsx:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './tarea3/App'   // aquí apuntas a la tarea activa

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Cambio de tarea:

```
import App from './tarea4/App'
```



### Ejercicio para practicar en React
- La forma más sencilla de empezar es usar una herramienta llamada **Vite**.  
- Creemos una nueva app usando la herramienta `create-vite`:  
  - Se instala con:  
    ```bash
    npm create vite@latest
    ```
- Ejemplo de salida:  
  ```bash
  PS C:...\fullstackopen2026> npm create vite@latest
  Need to install the following packages:
  create-vite@9.0.4
  Ok to proceed? (y) y

  > npx
  > create-vite

  ◇  Project name: partX
  ◇  Select a framework: React
  ◇  Select a variant: JavaScript
  ◇  Install with npm and start now? No
  ◇  Scaffolding project in C:...\fullstackopen2026\partX...
  └  Done. Now run:

    cd partX
    npm install
    npm run dev
  ```

- Luego se instala `npm` en la carpeta `partX`:  
  ```bash
  PS C:...\fullstackopen2026> cd partX
  PS C:...\fullstackopen2026\partX> npm install

  added 151 packages, and audited 152 packages in 15s
  36 packages are looking for funding
    run `npm fund` for details
  found 0 vulnerabilities
  ```

- Se abre con:  
  ```bash
  npm run dev
  ```

- Resultado:  
  ```bash
  > part1@0.0.0 dev
  > vite

  VITE v8.0.7  ready in 469 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
  ```

---
## Ahora en cada tareaX estará el readme de cada tarea que se realice.

# Full Stack Open 2026 - Parte 3 (Phonebook)

Este repositorio contiene la solución a los ejercicios de la Parte 3 del curso Full Stack Open. La aplicación consiste en un backend robusto para una agenda telefónica, integrado con un frontend de React.

## 🚀 Enlace de Despliegue
La aplicación está desplegada en Render y puedes acceder a los datos aquí:
**[Ver API en vivo](https://phonebook-backend-tu-usuario.onrender.com/api/persons)** *(Nota: Reemplaza este enlace con tu URL real de Render)*

## 🛠️ Tecnologías y Herramientas
- **Node.js & Express**: Servidor y API REST.
- **Middleware**: Morgan (logging), CORS (seguridad de origen), Express Static.
- **Despliegue**: Render / GitHub.
- **Entorno**: Gestión de variables con Dotenv.

## 📋 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/persons` | Devuelve todos los contactos en JSON. |
| GET | `/api/persons/:id` | Devuelve un contacto específico. |
| POST | `/api/persons` | Crea un nuevo contacto (valida nombre único). |
| DELETE | `/api/persons/:id` | Elimina un contacto por su ID. |
| GET | `/info` | Información de estado y fecha del servidor. |

## ⚙️ Instalación Local

1. Navega a la carpeta del backend: `cd part3/phonebook-backend`.
2. Instala las dependencias:
   ```bash
   npm install
   
Visualización por medio de Render: ttps://fullstackopen2026-ah-tree-main-part3.onrender.com/
