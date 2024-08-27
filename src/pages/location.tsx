import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';

 
const DynamicHeader = dynamic(() => import('../components/location/map'), {
  ssr: false,
})
function Location() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMapClick = (e: any) => {
    console.log(e)
    setLocation(e.latlng);
  };

  return (
    <div>
      <DynamicHeader/>
    </div>
  );
}

export default Location;
