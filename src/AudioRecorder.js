import React, { useState } from 'react';
import { Button } from 'reactstrap';
import mic from 'microphone-stream';

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
      {!recording && <Button id="start-button" onClick={startRecording} color="primary" title="Start Transcription">
        Capture Audio
        </Button>}
      {recording && <Button id="stop-button" onClick={stopRecording} color="secondary" title="Stop Transcription">
        Stop
        </Button>}
    </div>
  );
}

export default AudioRecorder;