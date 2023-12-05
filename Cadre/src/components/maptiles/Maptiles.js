import React, { useState } from 'react';
import ReactMapGL from '@goongmaps/goong-map-react';

const Maptiles = () => {
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });
    return <ReactMapGL />;
};

export default Maptiles;

