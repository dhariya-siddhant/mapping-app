import React, { useState } from "react";
import GoogleMapReact from "google-map-react";

const Map = ({ markers, center, zoom }) => {
  const [map, setMap] = useState(null);

  const handleApiLoaded = (map, maps) => {
    setMap(map);
  };

  const renderMarkers = () => {
    return markers.map((marker) => (
      <Marker key={marker.id} lat={marker.lat} lng={marker.lng} text={marker.name} />
    ));
  };

  const handleMarkerClick = (marker) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
    map.fitBounds(bounds);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAImWyCaTf-vIDH41knxKKr0MYqHIh2Yfg'}}
        defaultCenter={center}
        defaultZoom={zoom}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {renderMarkers()}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ text, onClick }) => (
  <div onClick={onClick} style={{ position: "relative", color: "white", background: "red", padding: "10px 15px", borderRadius: "50%" }}>
    {text}
  </div>
);

export default Map;
