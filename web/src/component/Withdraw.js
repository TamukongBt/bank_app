import React from 'react'
import {useState} from 'react'
import { Routes, Route, Link } from "react-router-dom";


const Withdraw = ({onWithdraw}) => {
    const [amount,setAmount] = useState('')
    const [address,setAddress] = useState('')

    const onSubmit = (e)=> {
        e.preventDefault()
       if (!amount){
           alert('put address details nor guy')
           return
       }
      onWithdraw({address,amount})
      setAddress('')
      setAmount('')
       }

  return (
    <div className='container'>
        <h3 className='text-center' >Withdraw Some Money</h3>
     <form className='add-form' onSubmit={onSubmit}>
        <div className='formControl'>
            <label>Amount</label>
              <input type="number" className="form-control"  placeholder="Enter Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
        </div>
        <div className='formControl'>
            <label>Address Number</label>
              <input type="text" className="form-control"  placeholder="Enter Address Number" value={address} onChange={(e)=>setAddress(e.target.value)}/>
        </div>
        <input type="submit" className="btn btn-block btn-danger" value="Withdraw"/>
      </form>
      <Link to="/">Home</Link><br/>
      <Link to="/deposit">Deposit</Link><br/>
      <Link to="/withdraw">Withdraw</Link><br/>
      <Link to="/register">Register</Link>
    </div>
   
  )
}

export default Withdraw