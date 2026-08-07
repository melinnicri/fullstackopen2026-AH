import { create } from 'zustand'

export const useUnicafeStore = create((set) => ({
    good: 0,
    neutral: 0,
    bad: 0,
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
}))