import React, { useEffect } from 'react';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { Storage, API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api'
import { getInference } from './graphql/queries'

import './ImageUpload.css';

Storage.configure({ level: 'public' });

const width = 320;    // We will scale the photo width to this
let height = 0;     // This will be computed based on the input stream

let streaming = false;
let video, canvas = null;

const startup = () => {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });

  video.addEventListener('canplay', function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  clearphoto();
}

const clearphoto = () => {
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function ImageUpload({ updateAlert }) {
  useEffect(() => {
    startup();
  }, []);

  const takePhoto = () => {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      video.pause();

      const data = canvas.toDataURL('image/png');
      const file = canvas.toBlob((blob) => {
        uploadFile('file', blob);
      });
    } else {
      clearphoto();
    }
  }

  const processFile = (evt) => {
    const context = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
      context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
    }

    const file = evt.target.files[0];
    const name = file.name;

    if (FileReader && file) {
      var fr = new FileReader();
      fr.onload = function (e) {
        img.src = fr.result;
      }
      fr.readAsDataURL(file);
    }

    video.pause();
    video.setAttribute('poster', file)
    uploadFile(name, file);
  }

  const uploadFile = (name, file) => {
    console.log(name, file);
    Storage.put(name, file).then((object) => {
      API.graphql(graphqlOperation(getInference, object)).then((results) => {
        console.log(results);
        updateAlert({ alert: results.data.getInference.class + ' (' + results.data.getInference.confidence + ')', visible: true, dismissable: true });
      });
    })
  }

  const showVideo = () => {
    clearphoto();
    video.play();
  }

  const triggerUpload = () => {
    document.getElementById('fileUpload').click();
  }

  return (
    <>
      <Row>
        <Col xs="12">
          <div className="camera">
            <video id="video">Video stream not available.</video>
            <canvas id="canvas">
            </canvas>
          </div>
        </Col>
        <Col xs="12">

        </Col>
      </Row>
      <Button id="playVideo" color="primary" onClick={showVideo}>Play Video</Button>
      &nbsp;&nbsp;
      <Button id="takePhoto" color="primary" onClick={takePhoto}>Take Photo</Button>
      &nbsp;&nbsp;
      <Button id="clickUpload" color="primary" onClick={triggerUpload}>Upload Photo</Button>
      &nbsp;&nbsp;
      <Input className="btn" type="file" name="file" id="fileUpload" onChange={processFile} color="primary" title="Upload File" />
    </>
  );
}

export default ImageUpload;
