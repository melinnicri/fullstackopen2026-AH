import { create } from 'zustand'

const useNotificationStore = create((set) => ({
    message: null,
    setNotification: (msg, seconds) => {
        set({ message: msg })
        setTimeout(() => {
            set({ message: null })
    }, seconds * 1000)
    }
}))

export const useNotificationMessage = () => useNotificationStore(state => state.message)

// SOLUCIÓN: Selecciona solo la función que necesitas, sin crear un objeto nuevo
export const useNotificationActions = () => useNotificationStore(state => state.setNotification)