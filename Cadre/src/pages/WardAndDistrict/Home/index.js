import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
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
import AnnotationDropdown from '~components/Dropdown/AnnotationDropdown';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import { useDispatch, useSelector } from 'react-redux';
import { setReportCoord, selectReportCoord } from '~/src/store/reducers';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function Home() {
  const dispatch = useDispatch();
  const point_coord = useSelector(selectReportCoord);

  const [filterActive, setFilterActive] = useState(false);
  const [annotationActive, setAnnotationActive] = useState(false);
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const [center, setCenter] = useState({
    lat: 10.763781,
    lng: 106.684918,
  });
  const [zoom, setZoom] = useState(15);

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
  const [isClickMarker, setIsClickMarker] = useState(false);

  useEffect(() => {
    setLocalStorageFromCookie('user-state');
    setLocalStorageFromCookie('user_type');
    setLocalStorageFromCookie('user_id');
    setLocalStorageFromCookie('token');
  }, []);

  const handleMapClick = (event) => {
    setIsClickMarker(false);
    setDisplayMarker(!displayMarker);
    setCollapseSidebar(false);
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setCurrentSpotId(null);
  };

  const handleMarkerClick = (_marker) => {
    setIsClickMarker(true);
    setDisplayMarker(true);
    setCollapseSidebar(false);
    setMarker({
      lat: _marker.lat,
      lng: _marker.lng,
    });

    setCurrentSpotId(_marker?.point_id);
  };

  const iconSize = 25;

  const selectIcon = (spot) => {
    if (spot.point_id) {
      if (spot.reportStatus === 'noReport' && spot.is_planning) return AdSpotPlanned;
      else if (spot.reportStatus === 'noReport' && !spot.is_planning) return AdSpotNotPlan;
      else if (spot.reportStatus === 'noProcess') return AdSpotBeReported;
      else if (spot.reportStatus === 'processed') return AdSpotSolvedReport;
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
          const data = res.data.data;
          setAdSpots(data);

          // Use for locate button in Report page
          if (point_coord) {
            const index = data.findIndex((item) => item.lat === +point_coord.lat && item.lng === +point_coord.lng);
            if (index !== -1) {
              handleMarkerClick(data[index]);
              setCenter({ lat: data[index].lat, lng: data[index].lng });
              // setZoom(16);
            }
            dispatch(setReportCoord(null));
          } else {
            // Set center
            const avgLat = data.map((item) => item.lat).reduce((a, b) => a + b, 0) / data.length;
            const avgLng = data.map((item) => item.lng).reduce((a, b) => a + b, 0) / data.length;
            setCenter({ lat: avgLat, lng: avgLng });
          }
        })
        .catch((error) => {
          console.log('Get spots error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, []);

  // Filter
  const [noReportStatus, setNoReportStatus] = useState(true);
  const [beReportedStatus, setBeReportedStatus] = useState(true);
  const [plannedStatus, setPlannedStatus] = useState(true);
  const [notPlanStatus, setNotPlanStatus] = useState(true);

  // Socket
  useSocketSubscribe('changeReport', async (res) => {
    const data = res.data;

    if (data.point_id) {
      const adSpotsIndex = adSpots.findIndex((spot) => spot.point_id === data.point_id);
      await axiosRequest
        .get(`/ward/getInfoByPointId/${data.point_id}`)
        .then((res) => {
          const _data = res.data.data;
          if (_data.spotInfo.reports === 0 && _data.boardInfo.every((board) => board.reports === 0))
            updateAdSpotsReportStatus(adSpotsIndex, 'processed');
          else updateAdSpotsReportStatus(adSpotsIndex, 'noProcess');
        })
        .catch((error) => {
          console.log('Get spot info error: ', error);
        });
    } else if (data.board_id) {
      await axiosRequest
        .get(`ward/getAdBoardByBoardId/${data.board_id}`)
        .then(async (res) => {
          const point_id = res.data.data.point_id;
          const adSpotsIndex = adSpots.findIndex((spot) => spot.point_id === point_id);

          await axiosRequest
            .get(`/ward/getInfoByPointId/${point_id}`)
            .then((res) => {
              const data = res.data.data;
              if (data.spotInfo.reports === 0 && data.boardInfo.every((board) => board.reports === 0))
                updateAdSpotsReportStatus(adSpotsIndex, 'processed');
              else updateAdSpotsReportStatus(adSpotsIndex, 'noProcess');
            })
            .catch((error) => {
              console.log('Get spot info error: ', error);
            });
        })
        .catch((error) => {
          console.log('Get AdBoard error: ', error);
        });
    } else {
      const lat = data.lat;
      const lng = data.lng;
      await axiosRequest
        .post(`ward/getReportDetailsByLatLng`, { lat: lat, lng: lng })
        .then(async (res) => {
          const reports = res.data.data.reports;
          const adSpotsIndex = adSpots.findIndex((spot) => spot.lat === lat && spot.lng === lng);
          if (reports.filter((report) => report.status !== 'Đã xử lý').length > 0)
            updateAdSpotsReportStatus(adSpotsIndex, 'noProcess');
          else updateAdSpotsReportStatus(adSpotsIndex, 'processed');
        })
        .catch((error) => {
          console.log('Get AdBoard error: ', error);
        });
    }
  });

  const updateAdSpotsReportStatus = (index, newReportStatus) => {
    setAdSpots((prevArray) =>
      prevArray.map((item, i) => (i === index ? { ...item, reportStatus: newReportStatus } : item))
    );
  };

  return (
    <div className={classes.main_container}>
      <div className={classes.map_container}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
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
            {/* <Polygon
              paths={boundary}
              options={{
                fillColor: 'transparent',
                strokeColor: colors.primary_300,
                strokeOpacity: 0.8,
                strokeWeight: 5,
                clickable: false,
              }}
            /> */}
            {displayMarker && <Marker position={marker} clickable={false} zIndex={1} />}
            {!loading &&
              adSpots
                .filter(
                  (spot) =>
                    (!noReportStatus ? spot.reportStatus !== 'noReport' : true) &&
                    (!beReportedStatus ? spot.reportStatus === 'noReport' : true) &&
                    (!plannedStatus ? !spot.is_planning : true) &&
                    (!notPlanStatus ? spot.is_planning : true)
                )
                .map((item, index) => (
                  <Marker
                    key={index}
                    position={{ lat: item.lat, lng: item.lng }}
                    icon={{
                      url: selectIcon(item),
                      scaledSize: isLoaded ? new window.google.maps.Size(iconSize, iconSize) : null,
                      anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
                      origin: new google.maps.Point(0, 0),
                    }}
                    onClick={() => handleMarkerClick(item)}
                    zIndex={0}
                  />
                ))}
          </GoogleMap>
        ) : (
          <>Loading...</>
        )}
      </div>

      <div className={classes.filter}>
        <div
          className={[classes.filter__ic, filterActive && classes['filter__ic--active']].join(' ')}
          onClick={() => setFilterActive(!filterActive)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </div>
        {filterActive && (
          <FilterDropdown
            setNoReportStatus={setNoReportStatus}
            setBeReportedStatus={setBeReportedStatus}
            setPlannedStatus={setPlannedStatus}
            setNotPlanStatus={setNotPlanStatus}
          />
        )}
      </div>

      <div className={classes.annotation}>
        {annotationActive && <AnnotationDropdown />}
        <div
          className={[classes.annotation__ic, annotationActive && classes['annotation__ic--active']].join(' ')}
          onClick={() => setAnnotationActive(!annotationActive)}
        >
          <FontAwesomeIcon icon={faCircleQuestion} />
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

      {displayMarker && (
        <SpotInfoSidebar
          spotCoord={marker}
          spotId={currentSpotId}
          adSpots={adSpots}
          setCollapse={setCollapseSidebar}
          isClickMarker={isClickMarker}
        />
      )}
    </div>
  );
}
