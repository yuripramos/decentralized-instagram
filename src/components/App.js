import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})


const App = () => {

  const [account, setAccount] = useState('');
  const [buffer, setBuffer] = useState('')
  const [decentragram, setDecentragram] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)


  const captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result))
      console.log('Buffer => ', buffer)
    }
  }

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

    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]
    if(networkData) {
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
      setDecentragram(decentragram)
      const imagesCount = await decentragram.methods.imageCount().call()
      setImages(imagesCount)
      setLoading(false)
    } else {
      window.alert('Decentragram contract not deployed to detect network.')
    }
  }

  const uploadImage = description => {
    console.log("Submitting files to ipfs")

    //Adding file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.log(error)
        return
      }

      // setLoading(true)
      // decentragram.methods.uploadImage(result[0].hash, description).send({ from: account}).on('transactionHash', hash => {
      //   setLoading(false)
      // })
    })
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navbar account={account} />
      {loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
          captureFile={captureFile}
          uploadImage={uploadImage}
          images={images}
          />
        }
    </div>
  );
}

export default App;
