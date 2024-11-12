# Decentralized Banking DApp - README

This project is a decentralized application (DApp) designed for secure banking transactions, built on Ethereum blockchain principles with homomorphic encryption for privacy and data integrity. Key transactions, including deposits, withdrawals, and transfers, are executed through smart contracts, with data encrypted off-chain and recorded on-chain. The project incorporates Paillier homomorphic encryption to ensure secure and efficient handling of sensitive data.

## Features
- **Homomorphic Encryption**: Transactions are encrypted off-chain with the Paillier encryption system, allowing safe storage and computation on the blockchain without data decryption.
- **Secure Transactions**: The DApp facilitates banking operations like account creation, deposits, withdrawals, and fund transfers through encrypted smart contracts.
- **Data Structure**: Transaction details and user information are stored on the blockchain, while hashed transaction IDs and encrypted credentials are held in an off-chain MySQL database for quicker query times.
- **Scalable Architecture**: Built with Truffle Suite, including Ganache, Truffle, and Drizzle, providing an Ethereum development environment for deploying and testing the DApp.

## Project Setup and Directory Structure
- **SQLite Database**: Includes a database to store user data and hashed transaction IDs.
- **Web Application**: A React.js front end powered by NestJS API, enabling user interaction and managing transaction flows.
  
### Directory Structure
- **/db**: Contains the SQLite database and MySQL tables for secure data storage.
- **/web**: Houses the web application files for the front-end interface.

## Technologies Used
- **Blockchain**: Ethereum (Tested locally with Ganache)
- **Encryption**: Paillier Homomorphic Encryption
- **Frontend**: React.js, Web3.js, NestJS, Crypto.js
- **Backend**: Truffle Suite (Truffle, Ganache), Solidity (for smart contracts)
- **Database**: MySQL, SQLite
- **Additional Libraries**: Paillier-bigint.js, AES encryption

## Key Processes

### Account Creation
Users create an account in the DApp, generating a private/public key pair for encryption. This encrypted data (user info, balance) is stored on the blockchain.

### Deposit
Deposits are processed by fetching the latest balance, decrypting with the private key, and verifying with the database. The deposit amount is encrypted and added to the blockchain.

### Withdrawal
Withdrawals initiate a similar process, checking the user’s balance and performing an encrypted subtraction before recording on the blockchain.

### Transfer
Transfers combine withdrawal from one account and deposit into another, with both transactions encrypted and recorded as a transfer entry on the blockchain.

## Requirements
- **Node.js**
- **Yarn** (for package management)
- **Truffle Suite**
- **Ganache** (for local blockchain testing)
- **MetaMask** (for wallet and transactions)

## Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```
2. **Navigate to the project folder**:
    ```bash
    cd your-repo
    ```

### Database Setup
1. **SQLite**:
   - Ensure `db.sqlite` is correctly configured in the `/db` directory.

2. **Web Application**:
   - Navigate to the `/web` folder.
   - Install dependencies and start the development server:
   ```bash
   cd web
   yarn install
   yarn dev
   ```

## Deployment & Testing
1. Start the **SQLite Database** and **MySQL Database** (if in production).
2. Start the **Web Application** by navigating to `/web` and running:
   ```bash
   yarn dev
   ```
3. Use MetaMask to connect to the local blockchain network (Ganache) for testing transactions.

## Data Flow Overview
The system allows users to interact with the DApp by encrypting data on the client side using their public key before upload. Transactions are processed on encrypted data within the DApp, and the results are sent back encrypted. Decryption is performed by the user on the client side, ensuring privacy throughout the process.

## Future Enhancements
- Adding support for multi-signature transactions
- Exploring gas optimization techniques
- Improving real-time query capabilities for large-scale production