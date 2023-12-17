import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import FilterDropdown from '~components/Dropdown/FilterDropdown';
import GoongAutoComplete from '~components/GoongAutoComplete';
import SpotInfoSidebar from '~components/SpotInfoSidebar';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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
  const [sidebarActive, setSidebarActive] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY,
    language: 'vi',
    region: 'vn',
  });

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className={classes.main_container}>
      <div className={classes.map_container}>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
            {/* Child components, such as markers, info windows, etc. */}
            <></>
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

      <div className={classes.search}>
        <GoongAutoComplete apiKey={process.env.REACT_APP_GOONG_APIKEY} placeholder="Tìm kiếm theo địa chỉ" />
      </div>

      {sidebarActive && <SpotInfoSidebar />}
    </div>
  );
}
