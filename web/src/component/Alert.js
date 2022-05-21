import React from 'react'

function Alert({message,color,display}) {
  return (
    <div class={color} role="alert" style={(display) ? {display:'block'} : {display:'none'}}>
    {message}
  </div>
  )
}

Alert.defaultProps = {
message:'',
color:'',
display:'display:"none"'
};

export default Alert