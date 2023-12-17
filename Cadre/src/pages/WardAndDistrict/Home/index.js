import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import FilterDropdown from '~components/Dropdown/FilterDropdown';
import GoongAutoComplete from '~components/GoongAutoComplete';
import SpotInfoSidebar from '~components/SpotInfoSidebar';
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';
import { colors } from '~styles/colors';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 10.763781,
  lng: 106.684918,
};

export default function Home() {
  const [filterActive, setFilterActive] = useState(false);
  const [collapseSidebar, setCollapseSidebar] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY,
    language: 'vi',
    region: 'vn',
  });

  const boundary = [
    { lat: 10.765435, lng: 106.681561 },
    { lat: 10.768416, lng: 106.684444 },
    { lat: 10.766171, lng: 106.689488 },
    { lat: 10.764203, lng: 106.690782 },
    { lat: 10.764956, lng: 106.692638 },
    { lat: 10.756456, lng: 106.685144 },
  ];

  const [displayMarker, setDisplayMarker] = useState(false);
  const [marker, setMarker] = useState();
  const handleMapClick = (event) => {
    setDisplayMarker(!displayMarker);
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <div className={classes.main_container}>
      <div className={classes.map_container}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            options={{
              zoomControl: false,
              fullscreenControl: false,
              disableDoubleClickZoom: true,
              draggableCursor: 'default',
              clickableIcons: false,
            }}
            onClick={handleMapClick}
          >
            <Polygon
              paths={boundary}
              options={{
                fillColor: 'transparent',
                strokeColor: colors.primary_300,
                strokeOpacity: 0.8,
                strokeWeight: 5,
                clickable: false,
              }}
            />
            {displayMarker && <Marker position={marker} />}
          </GoogleMap>
        ) : (
          <>Loading...</>
        )}
      </div>

      <div className={classes.filter}>
        {filterActive && <FilterDropdown />}
        <div
          className={[classes.filter__ic, filterActive && classes['filter__ic--active']].join(' ')}
          onClick={() => setFilterActive(!filterActive)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </div>
      </div>

      <div className={classes.search} onClick={() => console.log(collapseSidebar)}>
        <GoongAutoComplete
          apiKey={process.env.REACT_APP_GOONG_APIKEY}
          placeholder="Tìm kiếm theo địa chỉ"
          bgColor={displayMarker && !collapseSidebar && 'rgba(255,255,255,.8)'}
        />
      </div>

      {displayMarker && <SpotInfoSidebar spotCoord={marker} setCollapse={setCollapseSidebar} />}
    </div>
  );
}
