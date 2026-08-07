import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Después de cada prueba, limpia el DOM virtual simulado por jsdom
afterEach(() => {
    cleanup()
})