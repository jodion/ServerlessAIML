import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Predictions } from 'aws-amplify';

import './TextToSpeech.css';

function TextToSpeech({ updateAlert }) {
  const [voiceId, setVoiceId] = useState('Joanna');

  const speakText = () => {
    const textToSpeak = document.getElementById("transcribeResults").value;
    console.log(textToSpeak);

    Predictions.convert({
      textToSpeech: {
        source: {
          text: textToSpeak,
        },
        voiceId: voiceId
      }
    }).then(result => {
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      console.log({ AudioContext });
      const audioCtx = new AudioContext();
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
    <>
      <Button id="start-button" onClick={speakText} color="primary" title="Speak Text">
        Speak
      </Button>
      <Form>
        <FormGroup>
          <Label for="voiceSelection">Voice</Label>
          <Input type="select" name="select" id="voiceSelection" onChange={changeVoice} value={voiceId}>
            <option value="Joanna">Joanna (English)</option>
            <option value="Matthew">Matthew (English)</option>
            <option value="Chantal">Chantal (French)</option>
            <option value="Hans">Hans (German)</option>
            <option value="Mia">Mia (Spanish)</option>
          </Input>
        </FormGroup>
      </Form>
    </>
  );
}

export default TextToSpeech;
