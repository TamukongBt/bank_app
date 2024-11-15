import React from 'react'
import CryptoJS from 'crypto-js';
import { useState, useEffect } from 'react';
import * as paillier from 'paillier-bigint';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';
import Carbon from 'carbonjs';



function Transaction({transaction,user,total,count}) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [accno, setAccno] = useState('');
  const [transactions, setTransactions] = useState('');
  const [t_Count, setTransCount] = useState('');

  React.useEffect(() => {
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
  }, [navigate]);
    
   //   Deserialize BigInt to Store
   function deserialize(value) {
    const json = JSON.parse(value, (key, value) => {
      if (typeof value === 'string' && value.startsWith('BIGINT::')) {
        return BigInt(value.substr(8));
      }
      return value;
    });
    return json;
  }

  //  fetch private key
   var bytes = CryptoJS.AES.decrypt(user.sK, 'milkman');
   const sK_plain = bytes.toString(CryptoJS.enc.Utf8);
   const privateK = deserialize(sK_plain);
   const sK = deserialize(privateK.sK);

   const pK = deserialize(user.pK);
   const publicKey = new paillier.PublicKey(pK.n, pK.g);
   const privateKey = new paillier.PrivateKey(sK.lambda, sK.mu, publicKey);
   var dt = total[count]
   const enc =deserialize(dt)
    const amounts = privateKey.decrypt(enc)
    const date = Carbon.parse(transaction[6]).format("YYYY MM-DD");
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    const bill = numberWithCommas(Number(amounts))


  return (
    
        <div className='task' >
       <span className='prepend'> Amount : {bill} FCFA </span><br/>
       <span> Sender :{transaction[0]} </span><br/>
       <span> Type :{transaction[1]} </span><br/>
       <span> Date :{date} </span>

    </div>
    
  )
}

Transaction.propTypes = {}

export default Transaction
