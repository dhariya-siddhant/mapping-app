import React, { Fragment, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Modal } from "react-bootstrap";
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

Amplify.configure(awsExports);


function App({ signOut, user }) {
  const [markers, setMarkers] = useState([
    { name: "Taronga Zoo", position: [-33.8433, 151.2388] },
  ]);
  const [newMarkerName, setNewMarkerName] = useState("");
  const [newMarkerPosition, setNewMarkerPosition] = useState([-33.85, 151.25]);
  const [showNewMarkerDialog, setShowNewMarkerDialog] = useState(false);

  const handleAddMarker = () => {
    const existingIndex = markers.findIndex(
      (marker) =>
        marker.position[0] === newMarkerPosition[0] &&
        marker.position[1] === newMarkerPosition[1]
    );
    if (existingIndex !== -1) {
      // marker with the same position already exists
      alert("Marker with the same position already exists.");
      return;
    }
    setMarkers([
      ...markers,
      { name: newMarkerName, position: newMarkerPosition },
    ]);
    setNewMarkerName("");
    setShowNewMarkerDialog(false);
  };

  const handleDeleteMarker = (event, index) => {
    event.stopPropagation(); // prevent the click from triggering handleMarkerClick
    const newMarkers = [...markers];
    newMarkers.splice(index, 1); // remove the marker at the specified index
    setMarkers(newMarkers);
  };
  

  const handleMarkerClick = (index) => {
    const marker = markers[index];
    setNewMarkerName(marker.name);
    setNewMarkerPosition(marker.position);
    setShowNewMarkerDialog(true);
  };

  const handleMapClick = async (event) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.latlng.lat}&lon=${event.latlng.lng}`;
      const response = await fetch(url);
      const data = await response.json();
      setNewMarkerName(data?.address?.suburb ? data?.address?.suburb : data.display_name);
    } catch (error) {
      console.error("Error fetching address", error);
    }

    setNewMarkerPosition([event.latlng.lat, event.latlng.lng]);
  };

  function MapEvents() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  return (
    <Fragment>
          <Modal show={showNewMarkerDialog} onHide={() => setShowNewMarkerDialog(false)} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Add Marker</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <div>
                <label>
                  Name:
                  <input
                    type="text"
                    value={newMarkerName}
                    onChange={(event) => setNewMarkerName(event.target.value)}
                  />
                </label>
                <br />
                <label>
                  Latitude:
                  <input
                    type="number"
                    value={newMarkerPosition[0]}
                    onChange={(event) =>
                      setNewMarkerPosition([
                        parseFloat(event.target.value),
                        newMarkerPosition[1],
                      ])
                    }
                  />
                </label>
                <br />
                <label>
                  Longitude:
                  <input
                    type="number"
                    id="longitude"
                    value={newMarkerPosition[1]}
                    onChange={(event) =>
                      setNewMarkerPosition([
                        newMarkerPosition[0],
                        parseFloat(event.target.value),
                      ])
                    }
                  />
                </label>
              </div>
            </Modal.Body>
            <Modal.Footer>
                <Button  onClick={handleAddMarker} id="addBtn">Add</Button>
                <Button onClick={() => setShowNewMarkerDialog(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "1", padding: "1rem", overflowY: "scroll" }}>
        <h2>Markers</h2>
        <ul style={{ marginBottom: "40px" }}>
          {markers.map((marker, index) => (
            <li key={index} onClick={() => handleMarkerClick(index)}>
              {marker.name}
              <Button variant="danger" style={{ marginLeft: "20px" }} onClick={(event) => handleDeleteMarker(event, index)}>
                  X
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="primary" onClick={() => setShowNewMarkerDialog(true)}>
          + Add new marker
        </Button>
      </div>
      <div style={{ flex: "2" }}>
        <MapContainer center={[-33.85, 151.22]} zoom={12} style={{ height: "100%" }}>
          <MapEvents />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker, index) => (
            <Marker position={marker.position} key={index}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
    </Fragment>
  )
}

export default withAuthenticator(App);