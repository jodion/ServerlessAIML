import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { Predictions } from 'aws-amplify';

import './TranslateText.css';

function TranslateText({ updateAlert }) {
  const [language, setLanguage] = useState('fr');

  const translateText = () => {
    const textToTranslate = document.getElementById("transcribeResults").value;

    Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate,
        },
        targetLanguage: language
      }
    }).then(result => {
      const alertMsg = `${result.text} <a href="#" onClick="useNewText('${result.text.replace(/'/g, "\\'")}')" className="alert-link">[Use this text]</a>`;
      updateAlert({ alert: alertMsg, visible: true, dismissable: true });
    }).catch(err => console.log(JSON.stringify(err, null, 2)))
  }

  function changeLanguage(event) {
    setLanguage(event.target.value);
  }

  window.useNewText = function (text) {
    console.log(text);
    document.getElementById('transcribeResults').value = text;
    updateAlert({ alert: '', visible: false });
  }

  return (
    <Row>
      <Col xs="4" md="12">
        <Button id="start-button" onClick={translateText} color="primary" title="Translate Text">
          Translate
      </Button>
      </Col>
      <Col xs="8" md="12">
        <Form>
          <FormGroup>
            <Input type="select" name="select" id="languageSelection" onChange={changeLanguage} value={language}>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </Input>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
}

export default TranslateText;
