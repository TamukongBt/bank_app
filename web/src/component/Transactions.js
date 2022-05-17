import React from 'react'
import PropTypes from 'prop-types'
import Transaction from './Transaction'

function Transactions({transactions,onDelete}) {
  return (
     <div className='container' >
      {transactions.map((transaction) => (<div key={transaction.id}>
        <Transaction  transaction={transaction} onDelete={onDelete}/>
      </div>))}
     </div>
  
  )
}

Transactions.propTypes = {
    onDelete: PropTypes.func,
    transactions: PropTypes.array,
    
}

export default Transactions
