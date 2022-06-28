import React from 'react'
import PropTypes from 'prop-types'
import Transaction from './Transaction'

function Transactions({transactions,user,total}) {
  return (
     <div className='container' >
      {(transactions).map((transaction,index) => (
        <Transaction  count={index} key={index} transaction={transaction} user={user} total={total}/>
      ))} 
     </div>
  
  )
}

Transactions.propTypes = {
    onDelete: PropTypes.func,
    transactions: PropTypes.array,
    
}

export default Transactions
