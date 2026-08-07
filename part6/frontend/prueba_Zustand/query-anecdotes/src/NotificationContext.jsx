import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET': return action.payload
        case 'CLEAR': return ''
        default: return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')
    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
        {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const context = useContext(NotificationContext)
    return context[0]
}

export const useNotificationDispatch = () => {
    const context = useContext(NotificationContext)
    return context[1]
}

export const useNotify = () => {
    const dispatch = useContext(NotificationContext)[1]
    return (message) => {
        dispatch({ type: 'SET', payload: message })
        setTimeout(() => {
        dispatch({ type: 'CLEAR' })
        }, 5000)
    }
}

export default NotificationContext