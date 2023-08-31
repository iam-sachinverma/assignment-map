import React from "react";
import { GeoJSON } from "react-leaflet";

const IntersectingTiles = ({ intersectingTilesGeoJSON }) => {
  const tileStyle = {
    fillColor: "rgba(255, 0, 0, 0.3)",
    weight: 1,
    opacity: 1,
    color: "red",
    fillOpacity: 0.5,
  };

  return (
    <React.Fragment>
      {intersectingTilesGeoJSON.map((tileFeature, index) => (
        <GeoJSON key={index} data={tileFeature} style={tileStyle} />
      ))}
    </React.Fragment>
  );
};

export default IntersectingTiles;
