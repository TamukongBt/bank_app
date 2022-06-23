import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as paillierBigint from 'paillier-bigint';
import * as Carbon from 'carbonjs';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Alert from './Alert';
import * as bcrypt from 'bcryptjs';

function Register(props) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pass, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [message, setMessage] = useState('');
  const [display, setDispaly] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();

  function serialize(value) {
    const json = JSON.stringify(value, (key, value) =>
      typeof value === 'bigint' ? `BIGINT::${value}` : value,
    );
    return json;
  }

  async function paillier() {
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(
      2048,
    );
    const sK = serialize(privateKey);
    const pK = serialize(publicKey);
    //Encrypt private key
    var CryptoJS = require('crypto-js');

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify({ sK }),
      'milkman',
    ).toString();

    // Hash Passworrd
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(pass, salt);
    const isLogin = false

    // Hash password and check if matches
    const date = Carbon.parse(Date.now());
    const initialDeposit = CryptoJS.AES.encrypt(
      JSON.stringify({ amount}),
      'milkman',
    ).toString();
    console.log(initialDeposit)

    // register db
    console.log(address,
      initialDeposit,
      name,
      ciphertext,
      pK,
      date,
      password,)
    

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        accountNo: address,
        initialDeposit,
        name,
        sK: ciphertext,
        pK,
        date,
        password,
      });
      console.log(response);

      if (response.data.success) {
        clearField();
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const clearField = () => {
    setAddress('');
    setAmount('');
    setName('');
    setPassword('');
    setcPassword('');
    navigate('/login');
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!name || !amount || !address) {
      setDispaly('true');
      setMessage('FIll The fields');
      return;
    }
    if (pass !== cpassword) {
      setDispaly('true');
      setMessage('Passwords Do Not Match');
      return;
    } else {
      try {
        paillier();
      } catch (error) {
        console.log(error.message, error, error.response);
        setMessage(error.message);
        setDispaly('true');
      }
    }
  }

  return (
    <div className="container">
      <Alert color=" alert alert-danger" message={message} display={display} />
      <h3 className="text-center">Register New User</h3>
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Account Number"
            pattern=""
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Enter your Initial Deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Choose A Password"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Your Password"
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
      <Link to="/">Home</Link>
      <br />
      <Link to="/deposit">Deposit</Link>
      <br />
      <Link to="/withdraw">Withdraw</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}

Register.propTypes = {};

export default Register;
