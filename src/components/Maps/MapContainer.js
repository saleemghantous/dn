import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Form } from "react-bootstrap";

const MapContainer = ({ itemData, item, updateValue }) => {
  const [travelTime, setTravelTime] = useState(null);
  const [map, setMap] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState(itemData["address"]);
  const hospLocation = { lat: "32.7054362", lon: "35.3107485" };



  useEffect(() => {
    updateValue("address", address)
  }, [address])


  const handleSearch = () => {
    // Use OpenStreetMap Nominatim API for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const location = data[0];
          setCoordinates({ lat: location.lat, lon: location.lon });
        } else {
          console.error('Address not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching geocoding data', error);
      });
  };

  const handleMapRightClick = (e) => {
    const rightClickedCoordinates = e.latlng;
    setCoordinates({ lat: rightClickedCoordinates.lat, lon: rightClickedCoordinates.lng });
    setTravelTime(null); // Reset travel time when coordinates change
  };

  useEffect(() => {
    // Check if the map container is already initialized
    if (coordinates) {
      // Remove existing map instance
      if (map) {
        map.remove();
      }

      // Use Leaflet to display the map
      const newMap = L.map('map').setView([coordinates.lat, coordinates.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);

      // Add a custom marker to the map
      const customMarker = L.marker([coordinates.lat, coordinates.lon], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div>&#x1F4CD;</div>', // Unicode for a symbol, you can replace this with your own symbol
        }),
      });

      customMarker.addTo(newMap);

      // Fetch and display estimated travel time using OpenRouteService
      if (coordinates.lat && coordinates.lon) {
        fetchTravelTime(coordinates.lat, coordinates.lon);
      }

      // Attach the right-click event listener to the map
      newMap.on('contextmenu', handleMapRightClick);

      setMap(newMap);
    }
  }, [coordinates]);

  const fetchTravelTime = (destLat, destLon) => {
    // Use OpenRouteService API for routing and compute travel time
    fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62486151c181bb4f42bb844e546e293e20d5&start=${coordinates.lon},${coordinates.lat}&end=${hospLocation.lon},${hospLocation.lat}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const travelTimeInSeconds = data.features[0].properties.segments[0].duration;
          setTravelTime(travelTimeInSeconds);
        } else {
          console.error('Error fetching travel time data');
        }
      })
      .catch((error) => {
        console.error('Error fetching travel time data', error);
      });
  };

  const formatTravelTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} שעה ${minutes} דקות`;
  };
  return (
    <div className="">
      <div >
        <Form.Label>{item.header}</Form.Label>
        <Form.Group className="d-flex justify-content-between">
          <Form.Control
            type='text'
            placeholder=''
            value={address}
            onChange={(e) => { setAddress(e.target.value) }}
          />
          <Button className="mx-2" variant="secondary" onClick={handleSearch}>חפש</Button>{' '}

        </Form.Group>



      </div>
      {coordinates && (
        <div>
          {/**<p>Coordinates: {coordinates.lat}, {coordinates.lon}</p> */}
          {travelTime && <p>זמן הגעה מושער {formatTravelTime(travelTime)}</p>}
          {/* Container for Leaflet map */}
          <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
