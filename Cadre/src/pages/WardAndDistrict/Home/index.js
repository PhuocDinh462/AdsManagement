import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import FilterDropdown from '~components/Dropdown/FilterDropdown';
import GoongAutoComplete from '~components/GoongAutoComplete';
import SpotInfoSidebar from '~components/SpotInfoSidebar';
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';
import { colors } from '~styles/colors';
import axios from 'axios';
import {
  AdSpotPlanned,
  AdSpotNotPlan,
  AdSpotBeReported,
  AdSpotSolvedReport,
  SpotBeReported,
  SpotSolvedReport,
} from '~assets/markers';
import setLocalStorageFromCookie from '~/src/utils/setLocalStorageFromCookie';
import { axiosRequest } from '~/src/api/axios';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function Home() {
  const [filterActive, setFilterActive] = useState(false);
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const [center, setCenter] = useState({
    lat: 10.763781,
    lng: 106.684918,
  });

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
  const [currentSpotId, setCurrentSpotId] = useState(null);

  useEffect(() => {
    setLocalStorageFromCookie('user-state');
    setLocalStorageFromCookie('user_type');
    setLocalStorageFromCookie('user_id');
    setLocalStorageFromCookie('token');
  }, []);
  const handleMapClick = (event) => {
    setDisplayMarker(!displayMarker);
    setCollapseSidebar(false);
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setCurrentSpotId(null);
  };

  const handleMarkerClick = async (_marker) => {
    setDisplayMarker(true);
    setCollapseSidebar(false);
    setMarker({
      lat: _marker.lat,
      lng: _marker.lng,
    });

    setCurrentSpotId(_marker.point_id);

    // await axiosRequest
    //   .get(`ward/getInfoByPointId/${_marker.point_id}`)
    //   .then((res) => {
    //     // setCurrentAdSpot(res.data.data);
    //     console.log(res.data.data.spotInfo);
    //   })
    //   .catch((error) => {
    //     console.log('Get info error: ', error);
    //   });
  };

  const iconSize = 20;

  const selectIcon = (spot) => {
    if (spot.numberOfBoards > 0) {
      if (spot.reportStatus === 'noReport' && spot.is_planning) return AdSpotPlanned;
      else if (spot.reportStatus === 'noReport' && !spot.is_planning) return AdSpotNotPlan;
      else if (spot.reportStatus === 'noProcess') return AdSpotBeReported;
      else if (spot.reportStatus === 'Processed') return AdSpotSolvedReport;
    } else {
      if (spot.reportStatus === 'noProcess') return SpotBeReported;
      else return SpotSolvedReport;
    }
  };

  const handleSearch = async (place_id) => {
    if (!place_id) {
      setDisplayMarker(false);
      setCollapseSidebar(true);
      return;
    }

    await axios
      .get(`https://rsapi.goong.io/geocode?place_id=${place_id}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`)
      .then((res) => {
        const coord = res.data.results[0].geometry.location;
        setCenter(coord);
        setMarker(coord);
        setDisplayMarker(true);
        setCollapseSidebar(false);
        setCurrentSpotId(null);
      })
      .catch((error) => {
        console.log('Get place detail error: ', error);
      });
  };

  const [loading, setLoading] = useState(false);
  const [adSpots, setAdSpots] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await axiosRequest
        .get(`ward/getAdSpotsByWardId/1`)
        .then((res) => {
          setAdSpots(res.data.data);
        })
        .catch((error) => {
          console.log('Get spots error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, []);

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
              streetViewControl: false,
              mapTypeControl: false,
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
            {displayMarker && <Marker position={marker} clickable={false} />}
            {!loading &&
              adSpots.map((item) => (
                <Marker
                  key={item.point_id}
                  position={{ lat: item.lat, lng: item.lng }}
                  icon={{
                    url: selectIcon(item),
                    scaledSize: isLoaded ? new window.google.maps.Size(iconSize, iconSize) : null,
                    anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
                    origin: new google.maps.Point(0, 0),
                  }}
                  onClick={() => handleMarkerClick(item)}
                />
              ))}
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
        <GoongAutoComplete
          apiKey={process.env.REACT_APP_GOONG_APIKEY}
          placeholder="Tìm kiếm theo địa chỉ"
          collapseSidebar={!displayMarker || collapseSidebar}
          onChange={(place_id) => handleSearch(place_id)}
        />
      </div>

      {displayMarker && <SpotInfoSidebar spotCoord={marker} spotId={currentSpotId} setCollapse={setCollapseSidebar} />}
    </div>
  );
}
