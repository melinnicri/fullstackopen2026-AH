# Tarea Part11
# Patientor - Full Stack Open Chapter 11

Aplicación Full-Stack desarrollada para el curso Full Stack Open, migrada e integrada con un pipeline de CI/CD, pruebas automatizadas y despliegue en la nube.

## 🔗 Enlaces de Interés

* **Aplicación desplegada en Render y Vercel, Fly se hizo pelotas con Vercel:** [Ver Patientor en producción](https://app-patientor-2026-ah.vercel.app/))
* **Repositorio del proyecto:** [Ver código fuente en GitHub](https://github.com/melinnicri/fullstackopen2026-AH/tree/main/part11/Patientor))

## 🚀 Tecnologías utilizadas
* **Frontend:** React, TypeScript, Vite, Material-UI, React Router.
* PS C:...\fullstackopen2026-AH\part11\Patientor\frontend> npm run dev
* **Backend:** Node.js, Express, TypeScript, Mongoose, MongoDB Atlas, Zod.
* PS C:...\fullstackopen2026-AH\part11\Patientor\backend> npm run dev
* **CI/CD:** GitHub Actions (lint, build, despliegue condicional y protección de rama).

```
part11-patientor/
├── .github/
│   └── workflows/
│       └── pipeline.yml   <-- Aquí irá tu pipeline de CI/CD
├── backend/               <-- Tu servidor Express + Mongoose
├── frontend/              <-- Tu app de React + Vite
└── README.md              <-- Enlaces obligatorios
```
