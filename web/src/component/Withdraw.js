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

const Withdraw = ({ onWithdraw }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState('');
  const [address, setAddress] = useState('');
  const [accno, setAccno] = useState('');
  const [user, setUser] = useState('');
  const [account, setAccount] = useState('');
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
    loadWeb3();
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
    axios
    .get(`http://localhost:3000/user/` + userToken)
    .then(function (response) {
      setUser(response.data);
      if (!transactions.length) {
        axios
          .get(`http://localhost:3000/transactions/` + userToken)
          .then(function (t_response) {
            setTransactions(t_response.data);
            getbalance(response.data, t_response.data);
          });
      }
    });
    loadWeb3();

  }, [user,transactions]);

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

  async function transcounter() {
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

    return count;
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
    console.log('Here');
    const transfers = new web3.eth.Contract(
      BANKING_APP_ABI,
      BANKING_APP_ADDRESS,
    );
    const count = await transfers.methods.transCount().call();
    console.log(count);
    setTransCount(count);
    const transactionss = [];
    for (var i = 1; i <= t_Count; i++) {
      const task = await transfers.methods.transfers(i).call();
      transactionss.push(task);
    }
    return transactionss;
  }

  async function loadData(data) {
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
    const count = await transfers.methods.getTrans(data).call();

    return count.sender;
  }

  async function createTransaction(content, sender, reciever) {
    const web3 = window.web3;
    await web3.eth
      .getAccounts()
      .then(function (accounts) {
        setAccount(accounts);
      })
      .catch(function (err) {
        alert(err);
      });
    const transfers = new web3.eth.Contract(
      BANKING_APP_ABI,
      BANKING_APP_ADDRESS,
    );

    await transfers.methods
      .createTransaction(content, sender, reciever)
      .send({ from: account[0] });
  }

  async function getbalance(users, records){
   

    var bytes = CryptoJS.AES.decrypt(users.sK, 'milkman');
   const sK_plain = bytes.toString(CryptoJS.enc.Utf8);
   const privateK = deserialize(sK_plain);
   const sK = deserialize(privateK.sK);
   const pK = deserialize(users.pK);
   const publicKey = new paillier.PublicKey(pK.n, pK.g);
   const privateKey = new pail  lier.PrivateKey(sK.lambda, sK.mu, publicKey);
   if (records.length == 0) {
    var bytes = CryptoJS.AES.decrypt(users.initialDeposit, 'milkman');
    const current = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setBalance(Number(current.amount))
    
  } else {
    var last = records.length - 1
    const transcount = Number(records[last].transid)
    const enc_details = await loadData(transcount);
    const dec_details1=deserialize(enc_details)
    setBalance(Number(privateKey.decrypt(dec_details1)))
    
  }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!amount || !address) {
      setDispaly('true');
      setMessage('Fill All Fields');
      return;
    } else {
      if (accno === '') {
        console.log(user.accountNo);
        setAccno(user.accountNo);
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
      const type = 'WITHDRAW';
      const date = Carbon.parse(Date.now());
      var current = 0;
      var withdraw = BigInt(Number(-amount));
      console.log(withdraw);
      var withdraws = BigInt(Number(amount) + Number(4000));
      console.log(withdraws);

      const enct = publicKey.encrypt(withdraw);
      console.log(enct);
      const enc_amt = publicKey.encrypt(withdraws);
      console.log(enc_amt);
      const subs0 = publicKey.addition(enct, enc_amt);
      const dec_amt = privateKey.decrypt(subs0);
      console.log(dec_amt);

      if (transactions.length === 0) {
        setDispaly('true');
        setMessage('The Account is empty! Make a deposit');
        return;
      } else {
          var last = transactions.length - 1;
          console.log('first')
          const transcount = Number(transactions[last].transid);
          const enc_details = await loadData(transcount);
          const dec_details1=deserialize(enc_details)
          
          current = dec_details1;

          console.log(privateKey.decrypt(current))
      }
      const bigtotal = publicKey.addition(current, enct);
      const amt = privateKey.decrypt(bigtotal);
      console.log(amt);
      const total = serialize(bigtotal);
      const trans = [address, type, sender, reciever, total, userId,date];
      const content =CryptoJS.AES.encrypt(JSON.stringify(trans), user.sK).toString()
      const all = await transcounter();
     
      await createTransaction(content, total, userId);

      // GettransId
      console.log(all);
      var transid = all.toString();

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
      clearField();
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
      <h3>Balance: {balance} FCFA</h3>
      <Link to="/">Home</Link>
      <br />
      <Link to="/deposit">Deposit</Link>
      <br />
      <Link to="/withdraw">Withdraw</Link>
    </div>
  );
};

export default Withdraw;
