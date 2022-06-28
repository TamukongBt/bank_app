import * as React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import * as paillier from 'paillier-bigint';
import Deposit from './component/Deposit';
import Withdraw from './component/Withdraw';
import { Header } from './component/Header';
import Transactions from './component/Transactions';
import Register from './component/Register';
import Login from './component/Login';
import Logout from './component/Logout';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { BANKING_APP_ABI, BANKING_APP_ADDRESS } from './config';
import CryptoJS from 'crypto-js';

export default function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [account, setAccount] = useState('');
  const [recorded, setRecorded] = useState('');
  const [user, setUser] = useState('');
  const [total, setTotal] = useState('');
  const [transactions, setTransactions] = useState('');
  const [t_Count, setTransCount] = useState('');
  const [balance, setBalance] = useState('');
  const navigate = useNavigate();
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
    const usertrans = [];
    for (const element of recorded) {
      var i = Number(element.transid);
      const task = await transfers.methods.transfers(i).call();
      usertrans.push(task);
    }

    decryptcontent(usertrans);
    

  }

  function decryptcontent(transactions) {
    var content = [];
    var total = []
    for (let key in transactions) {
      var decrypted = CryptoJS.AES.decrypt(
        transactions[key].content,
        user.sK,
      );
      var data = CryptoJS.enc.Utf8.stringify(decrypted);
      content.push(JSON.parse(data));
      total.push(transactions[key].sender)
    }
    setTransactions(content);
    setTotal(total);
    
  }

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

  async function getbalance(users,records){
     //  fetch private key
   var bytes = CryptoJS.AES.decrypt(users.sK, 'milkman');
   const sK_plain = bytes.toString(CryptoJS.enc.Utf8);
   const privateK = deserialize(sK_plain);
   const sK = deserialize(privateK.sK);

   const pK = deserialize(users.pK);
   const publicKey = new paillier.PublicKey(pK.n, pK.g);
   const privateKey = new paillier.PrivateKey(sK.lambda, sK.mu, publicKey);
    var last = records.length - 1;
    const transcount = Number(records[last].transid);
    const enc_details = await loadData(transcount);
    const dec_details1=deserialize(enc_details)
    var   current = dec_details1;
    setBalance(Number(privateKey.decrypt(current)))
  }

  React.useEffect(() => {
    
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
    if(!user){
      axios
      .get(`http://localhost:3000/user/` + userToken)
      .then(function (response) {
        setUser(response.data);
        if(!recorded.length ){
          axios
          .get(`http://localhost:3000/transactions/` + userToken)
          .then(function (t_response) {
            setRecorded(t_response.data);
            getbalance(response.data,t_response.data);
          });
        }
      });
    }
    
    
    loadWeb3().then(()=>{
      loadBlockchainData();
   })

  }, [user,recorded]);
  return (
    <>
      <main>
        <nav> </nav>
        <h3 className="text-center py-4">Welcome User</h3>
        {transactions.length > 0 ? (
          <Transactions transactions={transactions} user={user} total={total} data={total}/>
        ) : (
          <div className="container">
            No Transactions Have Been Made with this address
          </div>
        )}
        <h3>Balance: {balance}</h3>
        <Link to="/">Home</Link>
        <br />
        <Link to="/deposit">Deposit</Link>
        <br />
        <Link to="/withdraw">Withdraw</Link>
        {/* <br /> */}
        {/* <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link> */}
        <br />
        <Link to="/logout">Logout</Link>
      </main>
    </>
  );
}
