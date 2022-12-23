import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, fromPrivateKey } from 'ethereum-cryptography/utils';
import axios from 'axios';
import React, { useState } from 'react';

function Wallet() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState('');
  const [signature, setSignature] = useState(null);

  async function signMessage(privateKey, messageHash) {
    // derive the signature from the private key and the message hash
    const signature = await secp.sign(messageHash, privateKey);
    setSignature(signature);
    console.log(signature);

    // send the signature and the message hash to the server
    const data = { signature, messageHash };
    const response = await axios.post('/verify', data);
  }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    console.log("private key:", privateKey);
    // derive the public key from the private key
    const publicKey = secp.getPublicKey(privateKey);
    // convert the public key to public address
    const address = toHex(publicKey);
    setAddress(address);
    console.log("public address:", address);    
    
    if (address) {
      // get the balance of the address
      const {
        data: { balance },
      } = await axios.get(`/balance/${address}`);
      setBalance(balance);
      console.log("balance:", balance); 
      console.log("address:", address);
      // call the signMessage function with the private key and a message hash
      const messageHash = 'a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28';
      signMessage(privateKey, messageHash);

    } else {
      setBalance(0);
      setSignature(null);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Address: { "0x" + address.slice(-40) }
      </div>
      {signature && <div>Signature: {signature}</div>}

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
