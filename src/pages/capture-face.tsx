import React, { useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import * as faceapi from "face-api.js";
import { useFaceDescriptor } from "../../hooks/useFaceDescriptor";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import Master from "@/components/Master";

const Test: React.FC<{ token: string }> = ({ token }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { saveFaceDescriptor, loading, setLoading } = useFaceDescriptor(token);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
        toast.error("Failed to load models. Please try again later.");
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    if (!videoRef.current) {
      console.warn("videoRef.current is null or undefined");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      console.log("Video streaming started.");
    } catch (error: any) {
      console.error("Error accessing webcam:", error);
    }
  };

  const detectFace = async () => {
    setLoading(true);
    if (!videoRef.current) {
      console.warn("Video element is not ready");
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log("Detections:", detections);

      if (detections.length > 0) {
        const face = detections[0];
        const faceDescriptor = new Float32Array([
          face.detection.box.x,
          face.detection.box.y,
          face.detection.box.width,
          face.detection.box.height,
        ]);

        const result = await saveFaceDescriptor(1, faceDescriptor);

        if (result.success) {
          console.log("Face descriptor saved successfully");
          setLoading(false);
        } else {
          console.error("Failed to save face descriptor:", result.message);
        }
      } else {
        toast.error("No face detected");
        console.log("No face detected");
      }
    } catch (error) {
      console.error("Error detecting face:", error);
    }

    setLoading(false);
  };

  return (
    <Master title="Scan Wajah">
      <div className="flex flex-col items-center px-20 gap-10 py-10">
        <p className="text-xl font-bold">Silahkan Scan wajah anda</p>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="600"
          height="600"
          className="rounded-full object-cover"
          style={{ aspectRatio: "1/1" }} // Ensures the video keeps a 1:1 aspect ratio
        />
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          style={{ display: "none" }}
          className="bg-red-300"
        />
        <Button onClick={detectFace} disabled={loading} loading={loading}>
          {loading ? "Processing..." : "Capture and Detect Face"}
        </Button>
      </div>
    </Master>
  );
};

export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context);
  const token = session?.accessToken || "";

  return {
    props: { token },
  };
};