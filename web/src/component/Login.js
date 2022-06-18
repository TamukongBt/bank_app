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

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.number || !formData.password) {
      setDispaly('true');
      setMessage('FIll The fields');
      return;
    } else {
      try {
        fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((data) => console.log(data.user));
      } catch (error) {
        setDispaly('true');
        setMessage(error.response);
      }
    }
  }

  function redirect(e) {
    e.preventDefault();
    // location.push('/');
    navigate('/');
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className='container' >
     
      <h1>Login Form</h1>
      <Alert color=" alert alert-danger" message={message} display={display} />
      <form className="add-form" onSubmit={(e) => redirect(e)}>
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
        <button className="btn btn-block btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
