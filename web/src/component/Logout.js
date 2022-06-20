import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function Logout() {
    const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("AuthUser");
    window.location.reload();
    navigate('/login')
    
  }
 

  return (
    <>
        <button onClick={logout}>Logout</button>
    </>
   
  );
}

export default Logout;
