import * as React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
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

export default function App() {
  // const [account, setAccount] = useState('');
  // const [transactions, setTransactions] = useState('');
  // const [t_Count, setTransCount] = useState(0);

  // const web3 = new Web3(window.web3.currentProvider);

  // async function loadWeb3() {
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum);
  //     await window.ethereum.enable();
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider);
  //   } else {
  //     console.log(
  //       'Non-Ethereum browser detected. You should consider trying MetaMask!',
  //     );
  //   }
  // }

  // async function loadBlockchainData() {
  //   const web3 = window.web3;
  //   const accounts = await web3.eth
  //     .getAccounts()
  //     .then(function (accounts) {
  //       setAccount(accounts);
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  //   const transfers = new web3.eth.Contract(
  //     BANKING_APP_ABI,
  //     BANKING_APP_ADDRESS,

  //   );
  //   setTransactions(transfers);
  //   const count = await transfers.methods.transCount().call();

  //   setTransCount(count);

  //   // for (var i = 1; i <= transCount; i++) {
  //   //   const task = await transactions.methods.transfers(i).call();
  //   //   this.setState({
  //   //     transfers: [...this.state.tasks, task],
  //   //   });
  //   // }
  // }

  // useEffect(() => {
  //   loadWeb3();
  //   loadBlockchainData();
  // }, []);
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
  const [transactions, setTransactions] = useState('');
  const [t_Count, setTransCount] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    const userToken = localStorage.getItem('AuthUser');
    if (!userToken) {
      navigate('/login');
    }
  
  return ()=>{
   
  };}, [t_Count]);   

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
    setTransactions(transfers);
    const count = await transfers.methods.transCount().call();
    setTransCount(count);
    const transactionss = [];
    for (var i = 1; i <= t_Count; i++) {
      const task = await transfers.methods.transfers(i).call();
      transactionss.push(task);
    }
    setTransactions(transactionss);
    console.log(transactionss);
  }

  return (
    <>
      <main>
        <nav> </nav>
        <h3 className="text-center py-4">Welcome User</h3>
        {transactions.length > 0 ? (
          <Transactions transactions={transactions} />
        ) : (
          <div className="container">
            No Transactions Have Been Made with this address
          </div>
        )}
        <Link to="/">Home</Link>
        <br />
        <Link to="/deposit">Deposit</Link>
        <br />
        <Link to="/withdraw">Withdraw</Link>
        <br />
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
        <br />
        <Link to="/logout">Logout</Link>
      </main>
    </>
  );
}
