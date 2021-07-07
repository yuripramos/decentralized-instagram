import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'


const App = () => {

  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false)


  const loadWeb3 = async () => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser Detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  useEffect(async () => {
    await loadWeb3()
    await loadBlockchainData()
  }, [])

  return (
    <div>
      <Navbar account={account} />
      {loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
          // Code...
          />
        }
    </div>
  );
}

export default App;
