const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const content = message.content ?? message.message
  const type = message.type || 'success'

  return (
    <div className={`notification ${type}`}>
      {content}
    </div>
  )
}

export default Notification