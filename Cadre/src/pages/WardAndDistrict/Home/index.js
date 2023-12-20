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
  const [currentAdSpot, setCurrentAdSpot] = useState(null);

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
    setCurrentAdSpot(null);
  };

  const handleMarkerClick = (_marker) => {
    setDisplayMarker(true);
    setCollapseSidebar(false);
    setMarker({
      lat: _marker.lat,
      lng: _marker.lng,
    });
    setCurrentAdSpot(_marker);
  };

  const adSpots = [
    {
      lat: 10.762619,
      lng: 106.684431,
      location_type: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      advertising_type: 'Cổ động chính trị',
      is_planning: true,
      boards: [
        {
          image_url: 'https://panoquangcao.net/wp-content/uploads/2020/09/bien-quang-cao-tren-duong-cao-toc-2.jpg',
          form_ad: '2.5m x 1.2m',
          reports: 0,
        },
        {
          image_url: 'https://chuinoxvang.com/upload/images/bang-hieu-pano1.jpg',
          form_ad: '3.2m x 1.6m',
          reports: 2,
        },
      ],
    },
    {
      lat: 10.762499,
      lng: 106.686613,
      location_type: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      advertising_type: 'Cổ động chính trị',
      is_planning: true,
      boards: [
        {
          image_url: 'https://panoquangcao.net/wp-content/uploads/2020/09/bien-quang-cao-tren-duong-cao-toc-2.jpg',
          form_ad: '2.5m x 1.2m',
          reports: 0,
        },
        {
          image_url: 'https://chuinoxvang.com/upload/images/bang-hieu-pano1.jpg',
          form_ad: '3.2m x 1.6m',
          reports: 0,
        },
      ],
    },
    {
      lat: 10.765068,
      lng: 106.687615,
      location_type: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      advertising_type: 'Cổ động chính trị',
      is_planning: false,
      boards: [
        {
          image_url: 'https://chuinoxvang.com/upload/images/bang-hieu-pano1.jpg',
          form_ad: '3.2m x 1.6m',
          reports: 0,
        },
      ],
    },
  ];

  const iconSize = 20;

  const selectIcon = (spot) => {
    if (spot.boards.some((element) => element.reports > 0)) return AdSpotBeReported;
    else if (!spot.is_planning) return AdSpotNotPlan;
    else return AdSpotPlanned;
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
        setCurrentAdSpot(null);
      })
      .catch((error) => {
        console.log('Get place detail error: ', error);
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
              streetViewControl: false,
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
            {adSpots.map((item, index) => (
              <Marker
                key={index}
                position={item}
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

      {displayMarker && <SpotInfoSidebar spotCoord={marker} adSpot={currentAdSpot} setCollapse={setCollapseSidebar} />}
    </div>
  );
}
