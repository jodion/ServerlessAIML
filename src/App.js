import React from 'react';
import Amplify, { Storage, Auth, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { graphqlOperation } from '@aws-amplify/api'
import { getInference } from './graphql/queries'

//import logo from './logo.svg';
import './App.css';

import config from './aws-exports'
Amplify.configure(config);

Auth.currentCredentials();

Auth.currentAuthenticatedUser({
  bypassCache: false
}).then(user => console.log(user))
  .catch(err => console.log(err));

Storage.configure({ level: 'public' });

const uploadFile = (evt) => {
  const file = evt.target.files[0];
  const name = file.name;

  document.getElementById('image').src = '';
  document.getElementById('predictionResults').innerHTML = '';

  if (FileReader && file) {
    var fr = new FileReader();
    fr.onload = function () {
      document.getElementById('image').src = fr.result;
    }
    fr.readAsDataURL(file);
  }

  Storage.put(name, file).then((object) => {
    API.graphql(graphqlOperation(getInference, object)).then((results) => {
      document.getElementById('predictionResults').innerHTML = results.data.getInference.class + ' (' + results.data.getInference.confidence + ')';
    });
  })
}

function App() {
  return (
    <div className="App">
      <p> Pick a file</p>
      <input type="file" onChange={uploadFile} />
      <p><img width="200" id="image" /></p>
      <p id="predictionResults"> </p>
    </div >
  );
}

//export default withAuthenticator(App, true);
export default App;
