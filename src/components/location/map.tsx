import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Setting default marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

function Map() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const DraggableMarker = () => {
    const [draggable, setDraggable] = useState(false);
    const [position, setPosition] = useState<L.LatLngExpression | null>(location);
    const markerRef = useRef<L.Marker | null>(null);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            setLocation({ lat: newPos.lat, lng: newPos.lng }); // Update the location state
          }
        },
      }),
      [],
    );

    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);

    useEffect(() => {
      if (location) {
        setPosition(location);
      }
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
                ? 'Marker is draggable'
                : 'Click here to make marker draggable'}
            </span>
          </Popup>
        </Marker>
        {/* Tambahkan Circle di sini dengan radius 5 km */}
        <Circle center={position} radius={50} />
      </>
    );
  };

  return (
    <div >
      <h1>Pilih Lokasi</h1>
      {location ? (
        <MapContainer
          center={location}
          zoom={20}
          style={{ height: '800px', width: '100%' }}
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
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
    </div>
  );
}

export default Map;
