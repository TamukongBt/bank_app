import React from 'react';
import { useState } from 'react';
import * as paillierBigint from 'paillier-bigint';
import { Routes, Route, Link } from 'react-router-dom';
import * as bigint from './BigInt';
import Alert from './Alert';

function Deposit({ onDeposit }) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [deposit, setDeposit] = useState('');
  const [message, setMessage] = useState('');
  const [display, setDispaly] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      setDispaly('true');
      setMessage('Account Compromised');
      return;
    } else {
     
      const current = bigint.deserialize(deposit)
      const check_current = bigint.deserialize(deposit)
      if (current != check_current) {
        
      } else{
        const key = bigint.deserialize(key)
        const enc_amt = key.encrypt(Number(amount))
      }
      
      
      // let c1 = publicKey.encrypt(m1);
      // let c2 = publicKey.encrypt(m2);
      // let encryptedSum = publicKey.addition(c1, c2);
      // let sum = privateKey.decrypt(encryptedSum);
      onDeposit({ address, amount });
      setAddress('');
      setAmount('');
    }
  };

  return (
    <div className="container">
      <h3 className="text-center">Deposit Some Money</h3>
      <Alert color=" alert alert-danger" message={message} display={display} />
      <form className="add-form" onSubmit={onSubmit}>
        <div className="formControl">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="formControl">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Address Number"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <input
          type="submit"
          className="btn btn-block btn-success"
          value="Deposit"
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

export default Deposit;
