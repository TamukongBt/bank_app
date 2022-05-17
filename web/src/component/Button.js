import propTypes from "prop-types";

const Button = ({title,onClick,className}) =>{
   
    return(
       <button className={className} 
       onClick={onClick}>{title}</button >
    )
}

Button.defaultProps = {
    title: 'Accept',
}

Button.propTypes = { 
    title: propTypes.string.isRequired,
    onClick: propTypes.func,
    
}



export default Button
