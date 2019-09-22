import React from 'react';
import { Container } from 'reactstrap';
import { Storage, API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api'
import { getInference } from './graphql/queries'

import './ImageUpload.css';

Storage.configure({ level: 'public' });

function ImageUpload() {
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

  return (
    <Container>
      <p> Pick a file</p>
      <input type="file" onChange={uploadFile} />
      <p><img alt="" width="200" id="image" /></p>
      <p id="predictionResults"> </p>
    </Container>
  );
}

export default ImageUpload;
