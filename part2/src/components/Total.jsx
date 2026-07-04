import React from 'react';

const Total = ({ parts }) => {
  // reduce recorre el array y acumula la suma de ejercicios
  const total = parts.reduce((sum, part) => {
    console.log('qué está pasando:', sum, part);
      return sum + part.exercises;
}, 0);

  return (
    <p><strong>total of {total} exercises</strong></p>
  );
};

export default Total;


