import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Deposit from './component/Deposit';
import Withdraw from './component/Withdraw';
import { Header } from './component/Header';
import Transactions from './component/Transactions';
import Register from './component/Register';

export default function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [transactions, setTransactions] = React.useState('');
  React.useEffect(() => {
    axios.get('http://localhost:3000/transactions').then(function (response) {
      setTransactions(response.data);
      console.log(response.data);
    });

    {
    }
  });

  function deleteTrans(id) {
    setTransactions(
      transactions.filter((transactions) => transactions.id !== id),
    );
  }

  return (
    <>
      <main>
        <nav></nav>
        <h3 className="text-center py-4">Welcome User</h3>
        {transactions.length > 0 ? (
          <Transactions transactions={transactions} onDelete={deleteTrans} />
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
      </main>
    </>
  );
}
