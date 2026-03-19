const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    border: '2px solid',
    padding: 10,
    marginBottom: 10,
    fontSize: 20,
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification