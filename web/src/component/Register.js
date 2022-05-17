import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as paillierBigint from 'paillier-bigint';
import * as Carbon from "carbonjs";
import { Routes, Route, Link } from 'react-router-dom'; 
import Alert from './Alert';

function Register(props) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const message = "Empty for now"
  const display = "none"

  async function paillier() {
    //   serialize BigInt to Store
    function serialize(value) {
      const json = JSON.stringify(value, (key, value) =>
        typeof value === 'bigint' ? `BIGINT::${value}` : value,
      );
      return json;
    }

     //   Deserialize BigInt to Store
    function deserialize(value) {
        const json = JSON.parse(value, (key, value) => {
            if (typeof value === "string" && value.startsWith('BIGINT::')) {
              return BigInt(value.substr(8));
            }
            return value;
          });
          return json;
      }


    const {publicKey,privateKey} = await paillierBigint.generateRandomKeys(
      2048,
    );
    // register db 
    const pK = serialize(publicKey)
    const sK = serialize(privateKey)
    const pass  = password
    const cpass  = cpassword
    const rounds  = 5
    // Hash password and check if matches  
    const date = Carbon.parse(Date.now())
    const initialDeposit = Number(amount)
      try {
        await axios.post("http://localhost:3000/user",{address,initialDeposit,name,sK,pK,date})
      } catch (error) {
        display = "display:block"
        message= error
      }
    
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!name || !amount || !address) {
      alert('Fill the empty fields');
      return;
    }

    paillier();
    setAddress('')
    setAmount('')
    setName('')
    setPassword('')
  }

  return (
    <div className="container">
      <h3 className="text-center">Register New User</h3>
      <form className="add-form" onSubmit={onSubmit}>
          <Alert color="alert alert-danger" message={message} display={display} />
        <div  className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className='formlabel'>Account Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Amount"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Initial Deposit</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Address Number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Choose A Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Initial Deposit</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Your PAssword"
            value={cpassword}
            onChange={(e) => setcPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          className="btn btn-block btn-primary"
          value="Register Now"
        />
      </form>
      <Link to="/">Home</Link><br/>
      <Link to="/deposit">Deposit</Link><br/>
      <Link to="/withdraw">Withdraw</Link><br/>
      <Link to="/register">Register</Link>
    </div>
  );
}

Register.propTypes = {};

export default Register;
