import React from 'react';
import API, { graphqlOperation } from '@aws-amplify/api'
import { getInference } from './graphql/queries'

import logo from './logo.svg';
import './App.css';

import config from './aws-exports'
API.configure(config);

async function generateInference() {
  const todo = { name: "Use AppSync", description: "Realtime and Offline" }
  await API.graphql(graphqlOperation(getInference, {}))
}

function App() {
  return (
    <div className="App">
      <button onClick={generateInference}>Get Inference</button>
    </div>
  );
}

export default App;
