import { create } from 'zustand'
// El 'set' que está dentro del paréntesis de 'create' 
// es el que le da vida al store.
export const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
  decrement: () => set(state => ({ counter: state.counter - 1 })),
  zero: () => set(() => ({ counter: 0 })),  
}))
