import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const Absensi = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load models from public directory
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load face detection models. ${err}`);
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = () => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
          videoRef.current!.addEventListener('play', () => {
            const canvas = canvasRef.current;
            if (canvas && videoRef.current) {
              canvas.width = videoRef.current.width;
              canvas.height = videoRef.current.height;
              const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
              faceapi.matchDimensions(canvas, displaySize);
              setInterval(async () => {
                try {
                  const detections = await faceapi.detectAllFaces(videoRef.current!)
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                  const resizedDetections = faceapi.resizeResults(detections, displaySize);
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                  }
                } catch (err) {
                  console.error('Error detecting faces: ', err);
                }
              }, 100);
            }
          });
        })
        .catch(err => {
          setError(`Error accessing webcam: ${err.message}`);
        });
    }
  };

  return (
    <div style={{ position: 'relative', width: '720px', height: '560px' }}>
      <h1>Absensi</h1>
      {loading && <p>Loading models...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={startVideo}>Start Detection</button>
      <div>
        <video ref={videoRef} width="720" height="560" style={{ position: 'absolute' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
      </div>
    </div>
  );
};

export default Absensi;
