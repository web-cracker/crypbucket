import React, { useState } from 'react';
import { ethers } from 'ethers';

const EthereumTransfer = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request MetaMask account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create an instance of ethers provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Prepare the transaction details
      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount), // Convert amount to wei
      };

      // Send the transaction
      const txResponse = await signer.sendTransaction(tx);
      await txResponse.wait(); // Wait for the transaction to be mined

      // Update state with the transaction hash
      setTransactionHash(txResponse.hash);
    } catch (err) {
      // Update state with error message
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ethereum Transfer</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Recipient Address:</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color: 'black' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Amount (ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color: 'black' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', backgroundColor: '#007BFF', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send ETH
        </button>
      </form>
      {transactionHash && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Transaction Successful</h2>
          <p>Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>{transactionHash}</a></p>
        </div>
      )}
      {error && (
        <div style={{ marginTop: '16px', color: '#FF0000' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Transaction Failed</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default EthereumTransfer;
