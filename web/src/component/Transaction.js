import React from 'react'


function Transaction({transaction,onDelete}) {
   
    
  return (
    
        <div className='task' onClick={()=>onDelete(transaction.id)}>
       <span> Amount: {transaction.amount} </span>
       <span> Sender:{transaction.sender} </span>
       <span> Transaction:{transaction.type} </span>

    </div>
    
  )
}

Transaction.propTypes = {}

export default Transaction
