import React from 'react';
import { Container, Button } from 'reactstrap';
import { Predictions } from 'aws-amplify';

import './CaptureSentiment.css';

function CaptureSentiment({ updateAlert }) {
  const interpretText = () => {
    const textToInterpret = document.getElementById("transcribeResults").value;
    console.log(textToInterpret);

    Predictions.interpret({
      text: {
        source: {
          text: 'textToInterpret',
          language: 'en'
        },
        type: "ALL"
      }
    }).then(result => {
      console.log(JSON.stringify(result, null, 2));
      updateAlert({ alert: JSON.stringify(result, null, 2), visible: true, dismissable: true });
    }).catch(err => console.log(JSON.stringify(err, null, 2)))
  }

  return (
    <Container>
      <Button id="start-button" onClick={interpretText} color="primary" title="Analyze Text">
        Analyze
          </Button>
    </Container>
  );
}

export default CaptureSentiment;
