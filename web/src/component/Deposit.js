import React from 'react'
import {useState} from 'react'
import { Routes, Route, Link } from "react-router-dom";



function Deposit({onDeposit}) {
    const [amount,setAmount] = useState('')
    const [address,setAddress] = useState('')

    const onSubmit = (e)=> {
        e.preventDefault()
       if (!amount){
           alert('put address details nor guy')
           return
       }
      onDeposit({address,amount})
      setAddress('')
      setAmount('')
       }

  return (
    <div className='container'>
        <h3 className='text-center'>Deposit Some Money</h3>
     <form className='add-form' onSubmit={onSubmit}>
        <div className='formControl'>
            <label>Amount</label>
              <input type="number" className="form-control"  placeholder="Enter Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
        </div>
        <div className='formControl'>
            <label>Address Number</label>
              <input type="text" className="form-control"  placeholder="Enter Address Number" value={address} onChange={(e)=>setAddress(e.target.value)}/>
        </div>
        <input type="submit" className="btn btn-block btn-primary" value="Deposit"/>
      </form>
      <Link to="/">Home</Link>
        <br />
        <Link to="/deposit">Deposit</Link>
        <br />
        <Link to="/withdraw">Withdraw</Link>
        <br />
        <Link to="/register">Register</Link>
    </div>
   
  )
}

export default Deposit