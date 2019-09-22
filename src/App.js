import React, { useState } from 'react';
import { Container, Jumbotron, Row, Col, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Amplify, { Auth } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import { withAuthenticator } from 'aws-amplify-react';

import ImageUpload from './ImageUpload';
import SpeechToText from './SpeechToText';
import TranslateText from './TranslateText';
import CaptureSentiment from './CaptureSentiment';
import TextToSpeech from './TextToSpeech';

import './App.css';
import logo from './aws.png';

import config from './aws-exports';

Amplify.configure(config);
Auth.currentCredentials();

Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  const [alert, setAlert] = useState();
  const [alertStyle, setAlertStyle] = useState('info');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertDismissable, setAlertDismissable] = useState(false);

  function onDismiss() {
    setAlertVisible(false);
  }

  function updateAlert({ alert, style, visible, dismissable }) {
    setAlert(alert ? alert : '');
    setAlertStyle(style ? style : 'info');
    setAlertVisible(visible);
    setAlertDismissable(dismissable ? dismissable : null);
  }

  return (
    <div className="App">
      <Container>
        <Jumbotron>
          <Row>
            <Col md="4">
              <img src={logo} alt="Logo" />
            </Col>
            <Col md="8">
              <h1>Serverless AI/ML on AWS</h1>
              <p>This is a set of simple demo that showcases AWS AI services in a JS application.</p>
            </Col>
          </Row>
        </Jumbotron>
        <Alert color={alertStyle} isOpen={alertVisible} toggle={alertDismissable ? onDismiss : null}>
          <p dangerouslySetInnerHTML={{ __html: alert }}></p>
        </Alert>
        <Row>
          <Col md="8">
            <Form>
              <FormGroup>
                <Label for="transcribeResults"></Label>
                <Input type="textarea" name="text" rows="10" id="transcribeResults" />
              </FormGroup>
            </Form>
            <Row>
              <Col xs="6" md="3">
                <SpeechToText updateAlert={updateAlert} />
              </Col>
              <Col xs="6" md="3">
                <CaptureSentiment updateAlert={updateAlert} />
              </Col>
              <Col md="3">
                <TranslateText updateAlert={updateAlert} />
              </Col>
              <Col md="3">
                <TextToSpeech updateAlert={updateAlert} />
              </Col>
            </Row>
          </Col>
          <Col md="4">
            <ImageUpload />
          </Col>
        </Row>
      </Container>
    </div >
  );
}

const federated = {
  google_client_id: '1006641500300-torj7pfp7nrbl8ibkugcrpnggqdo59a3.apps.googleusercontent.com'
};

export default withAuthenticator(App, true, [], federated);
//export default App;
