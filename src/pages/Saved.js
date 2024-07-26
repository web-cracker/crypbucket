import React, { useState, useEffect } from 'react';
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const BtcToWbtcConverter = () => {
  const [btcAmount, setBtcAmount] = useState('');
  const [wbtcAmount, setWbtcAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [account, setAccount] = useState(null);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [btcBalance, setBtcBalance] = useState(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,wrapped-bitcoin&vs_currencies=usd');
        const btcPrice = response.data.bitcoin.usd;
        const wbtcPrice = response.data['wrapped-bitcoin'].usd;
        setConversionRate(wbtcPrice / btcPrice);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, []);

  const handleBtcChange = (e) => {
    const value = e.target.value;
    setBtcAmount(value);
    if (conversionRate && value) {
      setWbtcAmount((value * conversionRate).toFixed(8));
    } else {
      setWbtcAmount('');
    }
  };

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const web3 = new Web3(provider);
        // Mock fetching BTC balance (Replace this with actual logic)
        const btcBalance = await fetchBtcBalance(accounts[0]);
        setBtcBalance(btcBalance);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  const fetchBtcBalance = async (account) => {
    // Mock API call to fetch BTC balance
    // Replace with actual logic to fetch BTC balance
    return 0.5; // Mock balance
  };

  const handleReceiverAddressChange = (e) => {
    setReceiverAddress(e.target.value);
  };

  const handleSwap = () => {
    if (account && receiverAddress && btcAmount) {
      console.log(`Swapping ${btcAmount} BTC to WBTC for ${receiverAddress}`);
      // Add swap logic here
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BTC to WBTC Converter</h1>
      <button
        style={{ ...styles.button, backgroundColor: account ? '#4caf50' : '#f6851b' }}
        onClick={account ? null : connectMetaMask}
        disabled={account}
      >
        {account ? 'Connected' : 'Connect MetaMask'}
      </button>
      {account && (
        <p style={styles.balance}>BTC Balance: {btcBalance} BTC</p>
      )}
      <div>
        <label style={styles.label}>
          BTC:
          <input
            type="number"
            value={btcAmount}
            onChange={handleBtcChange}
            placeholder="Enter BTC amount"
            style={styles.input}
          />
        </label>
      </div>
      <div>
        <label style={styles.label}>
          WBTC:
          <input
            type="text"
            value={wbtcAmount}
            readOnly
            placeholder="WBTC amount"
            style={{ ...styles.input, ...styles.readOnlyInput }}
          />
        </label>
      </div>
      <div>
        <label style={styles.label}>
          Receiver Address:
          <input
            type="text"
            value={receiverAddress}
            onChange={handleReceiverAddressChange}
            placeholder="Enter receiver's address"
            style={styles.input}
          />
        </label>
      </div>
      <button style={styles.swapButton} onClick={handleSwap} disabled={!account}>
        Swap BTC to WBTC
      </button>
      {conversionRate !== null && (
        <p style={styles.rate}>Conversion Rate: 1 BTC = {conversionRate.toFixed(8)} WBTC</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '100%',
    width: '400px',
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    top: '2rem',
    position: 'relative',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: 'black',
  },
  readOnlyInput: {
    backgroundColor: '#f9f9f9',
  },
  balance: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  rate: {
    textAlign: 'center',
  },
  swapButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4caf50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default BtcToWbtcConverter;
