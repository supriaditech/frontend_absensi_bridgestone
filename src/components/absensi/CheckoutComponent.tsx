import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, Spinner } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import { useCheckOut } from "../../../hooks/useCheckOut";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Mengatasi masalah dengan ikon marker bawaan Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const CheckoutComponent = () => {
  const { data: session } = useSession() as any;
  const token = session?.accessToken;
  const userId = session?.user?.id;
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const { checkOut, loading, setLoading, hasCheckedOut, statusLoading } =
    useCheckOut(token);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 1280, height: 720 } }) // Resolusi lebih tinggi untuk deteksi yang lebih baik
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing camera: ", err));
    };

    loadModels().then(startVideo);
  }, []);

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

  const handleFaceDetection = async () => {
    setLoading(true);
    let faceDescriptors: Float32Array[] = [];

    for (let i = 0; i < 5; i++) {
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
      setFaceDescriptor(averagedDescriptor);
      toast.success("Wajah berhasil di rekam");
    } else {
      toast.error("No face detected. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleCheckOutClick = async () => {
    if (!latitude || !longitude || !faceDescriptor) {
      toast.error("Please complete all checks before checking out.");
      return;
    }

    const result = await checkOut(userId, latitude, longitude, faceDescriptor);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className="check-out-component p-4 md:p-20">
      {location ? (
        <div className="lg:flex justify-center items-center gap-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="720"
            height="560"
            className="rounded-md mb-4 lg:mb-0"
          />
          <MapContainer
            center={location}
            zoom={20}
            className="z-0 rounded-md w-full h-[300px] md:h-[540px] lg:w-[720px]"
            style={{ zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location}>
              <Popup>Your current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4  p-20">
          <Spinner className="h-12 w-12" />
          <p>Loading...</p>
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-10">
        <Button
          onClick={handleFaceDetection}
          loading={loading}
          disabled={hasCheckedOut}
        >
          Detect Face
        </Button>

        <Button
          onClick={handleCheckOutClick}
          disabled={loading || hasCheckedOut}
        >
          {loading ? "Checking Out..." : "Check-Out"}
        </Button>
      </div>
      {hasCheckedOut && (
        <p className="text-center mt-2 text-green-500">
          Anda sudah check out hari ini.
        </p>
      )}
      <p className="text-center mt-2">
        Klik Detect Face dahulu untuk merekam wajah jika sudah berhasil terekam,
        silahkan klik Check-Out
      </p>
    </div>
  );
};

export default CheckoutComponent;
