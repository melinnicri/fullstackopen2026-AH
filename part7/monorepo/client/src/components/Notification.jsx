import useNotificationStore from '../store/notificationStore'

const Notification = () => {
    const notification = useNotificationStore((state) => state.notification)
    
    if (!notification) return null

        return <div style={{ border: '1px solid black', padding: '5px', margin: '10px 0' }}>{notification}</div>
}

export default Notification