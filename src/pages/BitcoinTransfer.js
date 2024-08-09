import React, { useState } from 'react';
import axios from 'axios';

const BitcoinTransfer = () => {
  const [senderAddress, setSenderAddress] = useState('');
  const [privateKeyWIF, setPrivateKeyWIF] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Function to fetch UTXOs
      const fetchUTXOs = async (address) => {
        const { data } = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`);
        return data.txrefs || [];
      };
      

      // Function to create the transaction
      const createTransaction = async () => {
        const tx = {
          inputs: [],
          outputs: [],
        };

        const utxos = await fetchUTXOs(senderAddress);
        let totalAmountAvailable = 0;
        const amountToSend = parseInt(amount, 10);
        const fee = 500;

        utxos.forEach(utxo => {
          tx.inputs.push({
            output: `${utxo.tx_hash}:${utxo.tx_output_n}`,
            script: '', // You need to set the appropriate script here
          });
          totalAmountAvailable += utxo.value;
        });

        if (totalAmountAvailable < amountToSend + fee) {
          throw new Error('Not enough balance to cover the amount and fee');
        }

        tx.outputs.push({
          address: recipientAddress,
          value: amountToSend,
        });

        const change = totalAmountAvailable - amountToSend - fee;
        if (change > 0) {
          tx.outputs.push({
            address: senderAddress,
            value: change,
          });
        }

        // Sign and send the transaction here
        // You will need to use the BlockCypher API to broadcast the transaction
        return tx;
      };

      const rawTransaction = await createTransaction();
      const broadcastTransaction = async (tx) => {
        const { data } = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {
          tx: JSON.stringify(tx),
        });
        return data.tx.hash;
      };

      const txHash = await broadcastTransaction(rawTransaction);
      setTransactionHash(txHash);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border:'1px solid', width:700, marginTop:'2rem', borderRadius:'10px'}}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Bitcoin Transfer</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Sender Address:</label>
          <input
            type="text"
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color:'black'   }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Sender Private Key (WIF):</label>
          <input
            type="text"
            value={privateKeyWIF}
            onChange={(e) => setPrivateKeyWIF(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color:'black' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Recipient Address:</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color:'black' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Amount (satoshis):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', color:'black' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', backgroundColor: '#007BFF', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send Bitcoin
        </button>
      </form>
      {transactionHash && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Transaction Successful</h2>
          <p>Transaction Hash: <a href={`https://testnet.blockchain.info/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>{transactionHash}</a></p>
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

export default BitcoinTransfer;
