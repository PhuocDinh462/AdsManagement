import React, { useState, useMemo, useCallback } from 'react';
import ReactMapGL, { Source, Layer, Popup, GeolocateControl } from '@goongmaps/goong-map-react';
import controlPanel from './controlPanel';
import { countiesLayer, highlightLayer } from './MapStyle';
import ControlPanel from './controlPanel';

const GOONG_MAPTILES_KEY = 'JeaptZwgnthElQ70ErS5tsogMbynbyesN469ZB6S'; // Set your Goong Maptiles key here

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};
const positionOptions = { enableHighAccuracy: true };

const Maptiles = () => {
  const [viewport, setViewport] = useState({
    latitude: 21.02727,
    longitude: 105.85119,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });

  const [settings, setSettings] = useState({
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85,
  });

  return (
    <div style={{ width: '77vw', height: '80vh' }}>
      <ReactMapGL
        {...viewport}
        {...settings}
        width="100%"
        height="100%"
        mapStyle={'https://tiles.goong.io/assets/goong_map_web.json'}
        onViewportChange={setViewport}
        goongApiAccessToken={GOONG_MAPTILES_KEY}
      >
        {/* <Source id="my-data" type="geojson" data={geojson}>
    <Layer {...layerStyle} />
  </Source> */}
        <GeolocateControl style={geolocateStyle} positionOptions={positionOptions} trackUserLocation auto />
      </ReactMapGL>
    </div>
  );
};

export default Maptiles;

