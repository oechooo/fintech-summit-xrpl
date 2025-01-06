// src/components/EthereumComponent.js

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTokenBalance, transferTokens } from '../utils/ethereumIntegration';

const EthereumComponent = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [status, setStatus] = useState('');

  // Function to connect to MetaMask and get the user's account
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setStatus('Error connecting wallet');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  };

  // Function to fetch the token balance
  const fetchBalance = async (address) => {
    const bal = await getTokenBalance(address);
    if (bal !== null) {
      setBalance(bal);
      setStatus('Balance fetched successfully');
    } else {
      setStatus('Error fetching balance');
    }
  };

  // Function to handle token transfer
  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      alert('Please enter both recipient address and amount');
      return;
    }

    if (!ethers.utils.isAddress(transferTo)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setStatus('Initiating transfer...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await transferTokens(signer, transferTo, transferAmount);
      if (tx) {
        setStatus('Transfer successful!');
        fetchBalance(account); // Update balance after transfer
      } else {
        setStatus('Transfer failed');
      }
    } catch (error) {
      console.error('Error during transfer:', error);
      setStatus('Transfer failed');
    }
  };

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount('');
          setBalance('0');
        }
      });
    }

    // Cleanup the listener on component unmount
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2>Ethereum Integration</h2>
      {!account ? (
        <button onClick={connectWallet} style={styles.button}>
          Connect MetaMask
        </button>
      ) : (
        <div>
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Token Balance:</strong> {balance}</p>
          <div style={styles.transferContainer}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleTransfer} style={styles.button}>
              Transfer Tokens
            </button>
          </div>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
    </div>
  );
};

// Simple styling for the component
const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
  },
  transferContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default EthereumComponent;