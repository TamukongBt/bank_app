import React from 'react';
import { useState } from 'react';
import * as paillierBigint from 'paillier-bigint';
import { Link, useNavigate } from 'react-router-dom';
import * as bigint from './BigInt';
import Alert from './Alert';
import axios from 'axios';
import big from './BigInt';

const Withdraw = ({ onWithdraw }) => {
  var CryptoJS = require('crypto-js');
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [accno, setAccno] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [display, setDispaly] = useState('');
  const userToken = localStorage.getItem('AuthUser');
  if (!userToken) {
    navigate('/login');
  }

  // clear on success
  const clearField = () => {
    setAddress('');
    setAmount('');
    setAccno('');
    navigate('/');
  };

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

  React.useEffect(() => {
    axios
      .get(`http://localhost:3000/user/` + userToken)
      .then(function (response) {
        setUser(response.data);
      });
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!amount || !address) {
      setDispaly('true');
      setMessage('Fill All Fields');
      return;
    } else {
      if (accno === '') {
        setAccno(user.accountNo);
      }

      // fetch private key
      var bytes = CryptoJS.AES.decrypt(user.sK, 'milkman');
      const sK_plain = bytes.toString(CryptoJS.enc.Utf8);
      const privatekey = deserialize(sK_plain);
      const publickey = deserialize(user.pK);

      // other details
      const userId = user.id;
      const sender = user.name;
      const reciever = user.name;
      const type = 'WITHDRAWAL';

      // decrypt blockchain data
      const current = privatekey.paillierBigint.decrypt(user.data);

      const check_current = bigint.deserialize(amount);
      if (current != check_current) {
      } else {
        const enc_amt = publickey.paillierBigint.encrypt(Number(-amount));
        const total = big.serialize(publickey.addition(enc_amt, current));
        // put info in blockchain
        const trans = [address, type, sender, reciever, total, userId];
        const transaction = publickey.paillierBigint.encrypt(
          JSON.stringify(trans),
        );

        try {
          const response = await axios.post(
            'http://localhost:3000/transactions',
            {
              address,
              type,
              sender,
              reciever,
              total,
              userId,
              user,
            },
          );
          console.log(response.data);

          if (response.data.success) {
            clearField();
          }
        } catch (error) {
          console.log('error', error);
        }
      }

      // let c1 = publicKey.encrypt(m1);
      // let c2 = publicKey.encrypt(m2);
      // let encryptedSum = publicKey.addition(c1, c2);
      // let sum = privateKey.decrypt(encryptedSum);
      setAddress('');
      setAmount('');
    }
  }

  return (
    <div className="container">
      <h3 className="text-center">Withdraw Some Money</h3>
      <form className="add-form" onSubmit={onSubmit}>
        <Alert
          color=" alert alert-danger"
          message={message}
          display={display}
        />
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
            placeholder={user.accountNo}
            value={accno}
            onChange={(e) => setAccno(e.target.value)}
          />
        </div>
        <div className="formControl">
          <input
            type="text"
            className="form-control"
            placeholder="Branch Name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <input
          type="submit"
          className="btn btn-block btn-danger"
          value="Withdraw"
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
};

export default Withdraw;
