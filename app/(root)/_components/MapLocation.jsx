"use client";
import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayerF,
} from "@react-google-maps/api";

const MapLocation = ({ locations }) => {
  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  const center = { lat: 29.945, lng: 76.818 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCYDYbrhpUNYw-GmBeHGOxMQQ6E4lA6Zyk", // Replace with your API key
    libraries: ["visualization"], // Add the required visualization library here
  });

  const heatmapData = isLoaded
    ? locations
        .filter(
          (loc) =>
            loc && loc.latitude !== undefined && loc.longitude !== undefined
        )
        .map(
          (loc) => new window.google.maps.LatLng(loc.latitude, loc.longitude)
        )
    : [];

  const heatmapOptions = {
    radius: 10,
    opacity: 0.6,
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={center}>
      {heatmapData.length > 0 && (
        <HeatmapLayerF data={heatmapData} options={heatmapOptions} />
      )}
    </GoogleMap>
  );
};

export default MapLocation;
