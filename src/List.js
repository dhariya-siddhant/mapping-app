import React from "react";

const List = ({ markers, onMarkerClick }) => {
  const renderMarkers = () => {
    return markers.map((marker) => (
      <li key={marker.id} onClick={() => onMarkerClick(marker)}>
        {marker.name}
      </li>
    ));
  };

  return <ul>{renderMarkers()}</ul>;
};

export default List;
