import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Predictions } from 'aws-amplify';

import './TranslateText.css';

function TranslateText({ updateAlert }) {
  const [language, setLanguage] = useState('fr');

  const translateText = () => {
    const textToTranslate = document.getElementById("transcribeResults").value;
    console.log(textToTranslate);

    Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate,
        },
        targetLanguage: language
      }
    }).then(result => {
      console.log(JSON.stringify(result, null, 2));
      const alertMsg = `${result.text} <a href="#" onClick="useNewText('${result.text.replace(/'/g, "\\'")}')" className="alert-link">[Use this text]</a>`;
      updateAlert({ alert: alertMsg, visible: true, dismissable: true });
    }).catch(err => console.log(JSON.stringify(err, null, 2)))
  }

  function changeLanguage(event) {
    setLanguage(event.target.value);
  }

  window.useNewText = function (text) {
    document.getElementById('transcribeResults').value = text;
    updateAlert({ alert: '', visible: false });
  }

  return (
    <>
      <Button id="start-button" onClick={translateText} color="primary" title="Translate Text">
        Translate
      </Button>
      <Form>
        <FormGroup>
          <Label for="voiceSelection">Voice</Label>
          <Input type="select" name="select" id="languageSelection" onChange={changeLanguage} value={language}>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
          </Input>
        </FormGroup>
      </Form>
    </>
  );
}

export default TranslateText;
