import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';   
import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';

function Login() {
  const [message, setMessage] = useState('');
  const [display, setDispaly] = useState('');
  let    navigate = useNavigate();
  const [formData, setFormData] = useState({
    number: '', // required
    password: '', // required
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.number || !formData.password) {
      setDispaly('true');
      setMessage('FIll The fields');
      return;
    } else {
      try {

        const response = await axios
      .post('http://localhost:3000/auth/login', {
        accountNo: formData.number,
        password: formData.password,
      })
        
        console.log(response)

        if (response.data.token) {
        localStorage.setItem('AuthUser', response.data.token)
        navigate('/');
      }
        
      } catch (error) {
        setDispaly('true');
        setMessage(error.message);
        console.log(error)
      }
    }
  }


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className='container' >
     
      <h1>Login Form</h1>
      <Alert color=" alert alert-danger" message={message} display={display} />
      <form className="add-form" >
        <div className="form-group">
          <input
            type="text"
            placeholder="Account Number"
            className="form-control"
            value={formData.number}
            name="number"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Password"
            className="form-control"
            value={formData.password}
            name="password"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <button className="btn btn-block btn-primary" onClick={handleSubmit}>
          Login
        </button>
      </form>
      <p>Are you a new user? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
