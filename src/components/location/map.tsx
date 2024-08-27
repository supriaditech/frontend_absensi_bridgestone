import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Circle,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useArea } from "../../../hooks/useArea";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  token: string;
  initialArea: {
    latitude: number;
    longitude: number;
    radius: number;
    name: string;
  } | null;
}

function Map({ token, initialArea }: MapProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialArea
      ? { lat: initialArea.latitude, lng: initialArea.longitude }
      : null
  );
  const [areaName, setAreaName] = useState(initialArea?.name || "");
  const [radius, setRadius] = useState(initialArea?.radius || 50); // Default radius

  const { upsertArea, loading } = useArea(token);

  useEffect(() => {
    if (!initialArea && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, [initialArea]);

  const DraggableMarker = () => {
    const [draggable, setDraggable] = useState(false);
    const [position, setPosition] = useState<L.LatLngExpression | null>(
      location
    );
    const markerRef = useRef<L.Marker | null>(null);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            setLocation({ lat: newPos.lat, lng: newPos.lng });
          }
        },
      }),
      []
    );

    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);

    useEffect(() => {
      if (location) {
        setPosition(location);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    if (position === null) return null;

    return (
      <>
        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        >
          <Popup minWidth={90}>
            <span onClick={toggleDraggable}>
              {draggable
                ? "Marker is draggable"
                : "Klik area putih untuk menggeser marker"}
            </span>
          </Popup>
          <Tooltip direction="top" opacity={1} permanent>
            {draggable ? "Marker is draggable" : "Klik untuk mengaktifkan drag"}
          </Tooltip>
        </Marker>
        <Circle center={position} radius={radius} />
      </>
    );
  };

  const handleSubmit = async () => {
    if (location && areaName && radius) {
      const result = await upsertArea({
        name: areaName,
        latitude: location.lat,
        longitude: location.lng,
        radius: radius,
      });

      if (result.success) {
        // Handle success, if needed
      }
    } else {
      toast.error("Mohon lengkapi semua data!", { autoClose: 3000 });
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Pilih Lokasi</h1>
      {location ? (
        <MapContainer
          center={location}
          zoom={20}
          className="w-full z-0"
          style={{ zIndex: 0, height: "80vh" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <DraggableMarker />
        </MapContainer>
      ) : (
        <p>Locating...</p>
      )}

      {location && (
        <div className="flex gap-4 mt-4">
          <Input
            crossOrigin={undefined}
            label="Masukan nama area"
            className="w-full"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
          <Input
            crossOrigin={undefined}
            label="Latitude"
            className="w-full"
            value={location.lat}
            readOnly
          />
          <Input
            crossOrigin={undefined}
            label="Longitude"
            className="w-full"
            value={location.lng}
            readOnly
          />
          <Input
            crossOrigin={undefined}
            label="Radius"
            className="w-full"
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Map;
