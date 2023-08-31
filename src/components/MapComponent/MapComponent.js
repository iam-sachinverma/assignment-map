import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { intersect } from "@turf/turf";
import IntersectingTiles from "../IntersectingTiles/IntersectingTiles";

const MapComponent = () => {
  const [drawnLayers, setDrawnLayers] = useState([]);
  const [tilesData, setTilesData] = useState(null);
  const [intersectingTilesGeoJSON, setIntersectingTilesGeoJSON] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://file.notion.so/f/s/1a1e461b-4293-428d-88da-5089a8cc8cf3/karnataka.geojson?id=79516c94-b1a0-48f7-ad9c-e45a34b740fa&table=block&spaceId=b59f6a36-2cae-40b9-a28b-2340823a5029&expirationTimestamp=1693548000000&signature=BxxWAqWVZ2TEzKHMHqJUXX2TnP682US0mtQ3btLlF6o&downloadName=karnataka.geojson"
        );
        const tilesData = await response.json();
        setTilesData(tilesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tilesData && drawnLayers.length > 0) {
      const intersectingTilesForShapes = drawnLayers.map((drawnLayer) => {
        const drawnShape = drawnLayer.toGeoJSON();
        return calculateIntersectingTiles(drawnShape, tilesData.features);
      });

      setIntersectingTilesGeoJSON(intersectingTilesForShapes);
    }
  }, [tilesData, drawnLayers]);

  const onDrawCreated = (e) => {
    const layer = e.layer;
    setDrawnLayers((prevDrawnLayers) => [...prevDrawnLayers, layer]);
  };

  const calculateIntersectingTiles = (drawnShape, tilesFeatures) => {
    const intersectingTiles = tilesFeatures.filter((tileFeature) => {
      const intersection = intersect(tileFeature.geometry, drawnShape.geometry);
      return !!intersection;
    });

    return intersectingTiles;
  };

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={7}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onDrawCreated}
          draw={{
            rectangle: true,
            polyline: false,
            polygon: true,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{
            remove: false,
            edit: false,
          }}
        />
      </FeatureGroup>
      {drawnLayers.map((layer, index) => (
        <Rectangle
          key={index}
          bounds={layer.getBounds()}
          pathOptions={{ color: "blue" }}
        />
      ))}
      {intersectingTilesGeoJSON.map((intersectingTiles, index) => (
        <IntersectingTiles
          key={index}
          intersectingTilesGeoJSON={intersectingTiles}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
