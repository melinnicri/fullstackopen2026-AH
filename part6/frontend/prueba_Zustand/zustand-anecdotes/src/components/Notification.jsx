import { useNotificationMessage } from '../notificationStore'

const Notification = () => {
  const message = useNotificationMessage()
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (message === null) return null

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification