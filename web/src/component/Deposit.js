import React from 'react';
import { useState } from 'react';
import * as paillier from 'paillier-bigint';
import { Link, useNavigate } from 'react-router-dom';
import Alert from './Alert';
import axios from 'axios';
import Web3 from 'web3';
import { BANKING_APP_ABI, BANKING_APP_ADDRESS } from '../config';
import CryptoJS from 'crypto-js';
import Carbon from 'carbonjs';

function Deposit({ onDeposit }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [depot, setDepot] = useState('');
  const [address, setAddress] = useState('');
  const [accno, setAccno] = useState('');
  const [user, setUser] = useState('');
  const [account, setAccount] = useState('');
  const [transid,setTransid] = useState('');
  const [transactions, setTransactions] = useState('');
  const [t_Count, setTransCount] = useState('');
  const [message, setMessage] = useState('');
  const [display, setDispaly] = useState('');


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

  //serialize
  function serialize(value) {
    const json = JSON.stringify(value, (key, value) =>
      typeof value === 'bigint' ? `BIGINT::${value}` : value,
    );
    return json;
  }

  React.useEffect(() => {
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
    axios
      .get(`http://localhost:3000/user/` + userToken)
      .then(function (response) {
        setUser(response.data);
      });
  }, [navigate]);

  React.useEffect(() => {
    loadWeb3();
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
    axios
      .get(`http://localhost:3000/transactions/` + userToken)
      .then(function (response) {
        setTransactions(response.data);
      });

    return () => {};
  }, [t_Count]);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      );
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    await web3.eth
      .getAccounts()
      .then(function (accounts) {
        setAccount(accounts);
      })
      .catch(function (err) {
        console.log(err);
      });
    const transfers = new web3.eth.Contract(
      BANKING_APP_ABI,
      BANKING_APP_ADDRESS,
    );
    const count = await transfers.methods.transCount().call();
    setTransCount(count);
    const transactionss = [];
    for (var i = 1; i <= t_Count; i++) {
      const task = await transfers.methods.transfers(i).call();
      transactionss.push(task);
    }
    
    return transactionss;
  }

  async function createTransaction(content, sender, reciever) {
    const web3 = window.web3;
    await web3.eth
      .getAccounts()
      .then(function (accounts) {
        setAccount(accounts);
      })
      .catch(function (err) {
        console.log(err);
      });
    const transfers = new web3.eth.Contract(
      BANKING_APP_ABI,
      BANKING_APP_ADDRESS,
    );

    console.log(account)
    await transfers.methods.createTransaction(content, sender, reciever).send({ from: account[0] });
  }
  

  async function onSubmit(e) {
    e.preventDefault();
    if (!amount || !address) {
      setDispaly('true');
      setMessage('Fill All Fields');
      return;
    } else {
      if (accno == '') {
        accno = user.accountNo;
      }
      // fetch private key
      var bytes = CryptoJS.AES.decrypt(user.sK, 'milkman');
      const sK_plain = bytes.toString(CryptoJS.enc.Utf8);
      const privateK = deserialize(sK_plain);
      const sK = deserialize(privateK.sK);

      const pK = deserialize(user.pK);
      const publicKey = new paillier.PublicKey(pK.n, pK.g);
      const privateKey = new paillier.PrivateKey(sK.lambda, sK.mu, publicKey);

      // other details
      const userId = user.id;
      const sender = user.name;
      const reciever = user.name;
      const type = 'DEPOSIT';
      const date = Carbon.parse(Date.now());
      // const transactions_chain = await loadBlockchainData();
      const enc_amt = publicKey.encrypt(BigInt(amount));
      
      if (transactions.length == 0) {
        var bytes = CryptoJS.AES.decrypt(user.initialDeposit, 'milkman');
        const current = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(current.amount)
        setDepot(Number(current.amount)) 
        
      } else {
        var last = transactions.length - 1
        // console.log(transactions)
        const transcount = Number(transactions[last].transid)
        const enc_details = await loadBlockchainData();
        
        const dec_details0=enc_details[transcount].sender
        const dec_details1=deserialize(deserialize(dec_details0))
        
        
        console.log(dec_details1)
        console.log(privateKey.decrypt(dec_details1))
        setDepot(dec_details1)
      }
      console.log(depot)
      const depott = BigInt(depot);
      // var m1 = publicKey.encrypt(BigInt(200))
      // var m2 = publicKey.encrypt(BigInt(300))
      // const mt=publicKey.addition(m1,m2);
      console.log(privateKey.decrypt(enc_amt))

      const bigtotal =publicKey.addition(enc_amt,depott);
      // const total =serialize(bigtotal);
      // const tortal =deserialize(total);
      const bigtotaldec =privateKey.decrypt(bigtotal);
      const bigtotaldec2 =privateKey.decrypt(depot);
      console.log(bigtotaldec, bigtotaldec2)
      const trans = '[address, type, sender, reciever, total, userId]';
      const transaction = publicKey.encrypt(JSON.stringify(trans));
      const content = serialize(transaction)
      return
      // await createTransaction(content, total, userId);

      // GettransId
      const all = await loadBlockchainData();
      var transid = all.length
      
      // put info in blockchain
      try {
        const response = await axios.post(
          'http://localhost:3000/transactions',
          {
            address,
            transactionType: type,
            transid,
            date,
            userId,
          },
        );
        console.log(response.data);

        if (response.data.success) {
          clearField();
        }
      } catch (error) {
        console.log('error', error);
      }

      // let c1 = publicKey.encrypt(m1);
      // let c2 = publicKey.encrypt(m2);
      // let encryptedSum = publicKey.addition(c1, c2);
      // let sum = privateKey.decrypt(encryptedSum);
      // onDeposit({ address, amount });
      // setAddress('');
      // setAmount('');
    }
  }

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
