import React, { useState } from 'react';
import Amplify, { Storage, Auth, API, Predictions } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { graphqlOperation } from '@aws-amplify/api'
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import { getInference } from './graphql/queries'

//import logo from './logo.svg';
import './App.css';

import config from './aws-exports';

import mic from 'microphone-stream';

Amplify.configure(config);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

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

function SpeechToText(props) {
  const [response, setResponse] = useState("Press 'start recording' to begin your transcription. Press STOP recording once you finish speaking.")

  function AudioRecorder(props) {
    const [recording, setRecording] = useState(false);
    const [micStream, setMicStream] = useState();
    const [audioBuffer] = useState(
      (function () {
        let buffer = [];
        function add(raw) {
          buffer = buffer.concat(...raw);
          return buffer;
        }
        function newBuffer() {
          console.log("reseting buffer");
          buffer = [];
        }

        return {
          reset: function () {
            newBuffer();
          },
          addData: function (raw) {
            return add(raw);
          },
          getData: function () {
            return buffer;
          }
        };
      })()
    );

    async function startRecording() {
      console.log('start recording');
      audioBuffer.reset();

      window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
        const startMic = new mic();

        startMic.setStream(stream);
        startMic.on('data', (chunk) => {
          var raw = mic.toRaw(chunk);
          if (raw == null) {
            return;
          }
          audioBuffer.addData(raw);

        });

        setRecording(true);
        setMicStream(startMic);
      });
    }

    async function stopRecording() {
      console.log('stop recording');
      const { finishRecording } = props;

      micStream.stop();
      setMicStream(null);
      setRecording(false);

      const resultBuffer = audioBuffer.getData();

      if (typeof finishRecording === "function") {
        finishRecording(resultBuffer);
      }

    }

    return (
      <div className="audioRecorder">
        <div>
          {recording && <button onClick={stopRecording}>Stop recording</button>}
          {!recording && <button onClick={startRecording}>Start recording</button>}
        </div>
      </div>
    );
  }

  function convertFromBuffer(bytes) {
    console.log('converting text');
    console.log(bytes);

    setResponse('Converting text...');

    Predictions.convert({
      transcription: {
        source: {
          bytes
        },
        language: "en-US",
      }
    }).then(({ transcription: { fullText } }) => setResponse(fullText))
      .catch(err => console.log(JSON.stringify(err, null, 2)))
  }

  return (
    <div className="Text">
      <div>
        <h3>Speech to text</h3>
        <AudioRecorder finishRecording={convertFromBuffer} />
        <p>{response}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <p> Pick a file</p>
      <input type="file" onChange={uploadFile} />
      <p><img width="200" id="image" /></p>
      <p id="predictionResults"> </p>
      <SpeechToText />
    </div >
  );
}

//export default withAuthenticator(App, true);
export default App;
