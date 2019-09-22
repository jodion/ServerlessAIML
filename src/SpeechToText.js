import React from 'react';
import { Predictions } from 'aws-amplify';
import AudioRecorder from './AudioRecorder';

import './SpeechToText.css';

function SpeechToText({ updateAlert }) {
  function convertFromBuffer(bytes) {
    updateAlert({ alert: 'Converting text...', visible: true });

    Predictions.convert({
      transcription: {
        source: {
          bytes
        },
        language: "en-US",
      }
    }).then(({ transcription: { fullText } }) => {
      updateAlert({ alert: '', visible: false });
      document.getElementById("transcribeResults").value = fullText + "\n";
    }).catch(err => console.log(JSON.stringify(err, null, 2)))
  }

  return (
    <div className="SpeechToText">
      <AudioRecorder finishRecording={convertFromBuffer} transcribeResults />
    </div >
  );
}

export default SpeechToText;
