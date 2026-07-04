const Notification = ({ message, type }) => {
  // Si no hay mensaje, no dibujes nada en la pantalla
  if (message === null) {
    return null
  }

  // Estilos básicos para que parezca una barra de alerta
  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green', // Rojo si falla, verde si es un éxito
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification