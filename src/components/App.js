import React, { useState } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'


const App = () => {

  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false)

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
