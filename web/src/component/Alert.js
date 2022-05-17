import React from 'react'

function Alert({message,color,display}) {
  return (
    <div class={color} role="alert" style={{display:{display}}}>
    {message}
  </div>
  )
}

Alert.propTypes = {
  
};

export default Alert