// src/App.js

import React from 'react';
import EthereumComponent from './components/EthereumComponent';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Fintech Summit XRPL Bridge</h1>
      <EthereumComponent />
      {/* Future components like XRPLComponent and BridgeComponent will be added here */}
    </div>
  );
}

export default App;