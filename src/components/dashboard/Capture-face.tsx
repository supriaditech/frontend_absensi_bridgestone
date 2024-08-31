import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";
import Master from "@/components/Master";
import { Button } from "@material-tailwind/react";
import { useFaceDescriptor } from "../../../hooks/useFaceDescriptor";

interface CaptureFaceProps {
  token: string;
  onClose: () => void;
  id: any;
}

const CaptureFace: React.FC<CaptureFaceProps> = ({ token, onClose, id }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { saveFaceDescriptor, loading, setLoading } = useFaceDescriptor(token);
  const { data: session } = useSession() as any;

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
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
        video: { width: 1280, height: 720 }, // Resolusi lebih tinggi untuk deteksi yang lebih baik
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (error: any) {
      console.error("Error accessing camera: ", error);
    }
  };

  const detectFace = async () => {
    setLoading(true);
    let faceDescriptors: Float32Array[] = [];

    for (let i = 0; i < 5; i++) {
      // Ambil beberapa frame untuk rata-rata deskriptor
      if (videoRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          faceDescriptors.push(detections[0].descriptor);
        }
        await new Promise((resolve) => setTimeout(resolve, 200)); // Tunggu sebentar sebelum frame berikutnya
      }
    }

    if (faceDescriptors.length > 0) {
      const averagedDescriptor = calculateMeanDescriptor(faceDescriptors); // Menghitung rata-rata deskriptor

      const result = await saveFaceDescriptor(
        session?.user?.id,
        averagedDescriptor
      );

      if (result.success) {
        onClose(); // Close the modal only on success
      } else {
        console.error("Failed to save face descriptor:", result.message);
        toast.error("Failed to save face descriptor. Please try again.");
      }
    } else {
      toast.error("No face detected. Please try again.");
    }

    setLoading(false);
  };

  // Fungsi untuk menghitung rata-rata deskriptor wajah
  const calculateMeanDescriptor = (
    descriptors: Float32Array[]
  ): Float32Array => {
    if (descriptors.length === 0) return new Float32Array();

    const meanDescriptor = new Float32Array(descriptors[0].length);

    for (let i = 0; i < descriptors.length; i++) {
      for (let j = 0; j < descriptors[i].length; j++) {
        meanDescriptor[j] += descriptors[i][j];
      }
    }

    for (let j = 0; j < meanDescriptor.length; j++) {
      meanDescriptor[j] /= descriptors.length;
    }

    return meanDescriptor;
  };

  return (
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
  );
};

export default CaptureFace;
