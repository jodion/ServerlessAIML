import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Predictions } from 'aws-amplify';

import './TextToSpeech.css';

function TextToSpeech({ updateAlert }) {
  const [voiceId, setVoiceId] = useState('Joanna');

  const speakText = () => {
    const textToSpeak = document.getElementById("transcribeResults").value;
    console.log(textToSpeak);

    function unlockAudioContext(audioCtx) {
      if (audioCtx.state !== 'suspended') return;
      const b = document.body;
      const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
      events.forEach(e => b.addEventListener(e, unlock, false));
      function unlock() { audioCtx.resume().then(clean); }
      function clean() { events.forEach(e => b.removeEventListener(e, unlock)); }
    }

    Predictions.convert({
      textToSpeech: {
        source: {
          text: textToSpeak,
        },
        voiceId: voiceId
      }
    }).then(result => {
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      unlockAudioContext(audioCtx);
      const source = audioCtx.createBufferSource();
      audioCtx.decodeAudioData(result.audioStream, (buffer) => {
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }, (err) => console.log({ err }));
    })
      .catch(err => console.log(err))
  }

  function changeVoice(event) {
    setVoiceId(event.target.value);
  }

  return (
    <Row>
      <Col xs="4" md="12">
        <Button id="start-button" onClick={speakText} color="primary" title="Speak Text">
          Speak
      </Button>
      </Col>
      <Col xs="8" md="12">
        <Form>
          <FormGroup>
            <Input type="select" name="select" id="voiceSelection" onChange={changeVoice} value={voiceId}>
              <option value="Joanna">Joanna (English)</option>
              <option value="Matthew">Matthew (English)</option>
              <option value="Chantal">Chantal (French)</option>
              <option value="Hans">Hans (German)</option>
              <option value="Mia">Mia (Spanish)</option>
            </Input>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
}

export default TextToSpeech;
