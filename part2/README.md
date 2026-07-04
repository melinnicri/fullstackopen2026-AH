---
```text
# Tarea 2  
## Conceptos básicos de React  

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

  ◇  Project name: part2
  ◇  Select a framework: React
  ◇  Select a variant: JavaScript
  ◇  Install with npm and start now? No
  ◇  Scaffolding project in C:...\fullstackopen2026\part2...
  └  Done. Now run:

    cd part2
    npm install
    npm run dev
  ```

- Luego se instala `npm` en la carpeta `part2`:  
  ```bash
  PS C:...\fullstackopen2026> cd part2
  PS C:...\fullstackopen2026\part2> npm install

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

## Respuesta 2.1: Información del curso Paso 6
Se crea la carpeta `components` dentro de `src`:

```
src/
├── App.jsx
├── main.jsx
└── components/
    ├── Content.jsx
    ├── Course.jsx
    ├── Header.jsx
    ├── Part.jsx   (opcional)
```

**App.jsx:**
```jsx
import React from 'react';
import Course from './components/Course';

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      { name: 'Fundamentals of React', exercises: 10, id: 1 },
      { name: 'Using props to pass data', exercises: 7, id: 2 },
      { name: 'State of a component', exercises: 14, id: 3 }
    ]
  };

  return (
    <div>
      <Course course={course} />
    </div>
  );
};

export default App;
```

---

## Respuesta 2.2: Información del curso Paso 7
Se agrega el archivo **Total.jsx** en `components`:

```jsx
import React from 'react';

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p><strong>total of {total} exercises</strong></p>;
};

export default Total;
```

Y se añade la parte **Redux** en el curso dentro de `App.jsx`.

---

## Respuesta 2.3*: Información del curso Paso 8
Uso de `reduce` en **Total.jsx**:

```jsx
const total = parts.reduce((sum, part) => sum + part.exercises, 0);
```

Con depuración usando `console.log`:

```jsx
const total = parts.reduce((sum, part) => {
  console.log('qué está pasando:', sum, part);
  return sum + part.exercises;
}, 0);
```

---

## Respuesta 2.4: Información del curso Paso 9
Se agregan más cursos en `App.jsx`:

```jsx
import React from 'react';
import Course from './components/Course';

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ];

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
        <Course key={course.id} course={course} />
      )}
    </div>
  );
};

export default App;
```

- **Half Stack application development → 42 ejercicios**  
- **Node.js → 10 ejercicios**  

Cada curso calcula su total de manera independiente gracias a `reduce`.

---

## Respuesta 2.5: Módulo independiente
Se compactan `Header`, `Content` y `Total` dentro de **Course.jsx**:

```jsx
import React from 'react';

const Header = ({ course }) => <h2>{course.name}</h2>;

const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>
);

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p><strong>total of {total} exercises</strong></p>;
};

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

export default Course;
```

**App.jsx:**
```jsx
import React from 'react';
import Course from './components/Course';

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ];

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
        <Course key={course.id} course={course} />
      )}
    </div>
  );
};

export default App;
```

---
