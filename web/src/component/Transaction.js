import React from 'react'


function Transaction({transaction,onDelete}) {
   
    
  return (
    
        <div className='task' onClick={()=>onDelete(transaction.id)}>
       <p> Amount: {transaction.amount} </p>
       <p> Sender:{transaction.address} </p>
       <p> Transaction:{transaction.type} </p>

    </div>
    
  )
}

Transaction.propTypes = {}

export default Transaction
