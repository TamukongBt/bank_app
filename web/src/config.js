export const BANKING_APP_ADDRESS = '0xb8eFa5f8BCaffa9BAC0F00646B2B2114f22f14bE'

export const BANKING_APP_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "transCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "transfers",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "sender",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "reciever",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_content",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_sender",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_reciever",
            "type": "string"
          }
        ],
        "name": "createTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_reciever",
            "type": "uint256"
          }
        ],
        "name": "getTrans",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "content",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "sender",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "reciever",
                "type": "string"
              }
            ],
            "internalType": "struct Transfer.Transaction",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
]