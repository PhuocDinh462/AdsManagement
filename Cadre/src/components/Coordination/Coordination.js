import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import classes from './Coordination.module.scss';
import GoongAutoComplete from '../GoongAutoComplete/index';
import axios from 'axios';

const Coordination = ({ setLatitude, setLongitude, setAddress, setModalMap, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [autoCompleteValue, setAutoCompleteValue] = useState();
  const [displayInitialPosition, setDisplayInitialPosition] = useState(true);
  const [centerMap, setCenterMap] = useState();

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedPosition({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
    setDisplayInitialPosition(false);

    (async () => {
      await axios
        .get(
          `https://rsapi.goong.io/Geocode?latlng=${latLng.lat()},${latLng.lng()}&api_key=${
            process.env.REACT_APP_GOONG_APIKEY
          }`
        )
        .then((res) => {
          const data = res.data.results;
          setAddress(data[0]?.formatted_address);
          setAutoCompleteValue(data[0]?.formatted_address);
        })
        .catch((error) => {
          console.log('Get spot info error: ', error);
        })
        .finally(() => {});
    })();
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setInitialPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }, []);

  const handleSearch = async (place_id) => {
    if (!place_id) {
      setSelectedPosition(null);
      setDisplayInitialPosition(true);
      setLatitude(null);
      setLongitude(null);
      return;
    }

    await axios
      .get(`https://rsapi.goong.io/geocode?place_id=${place_id}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`)
      .then((res) => {
        const coord = res.data.results[0].geometry.location;
        setSelectedPosition(coord);
        setDisplayInitialPosition(false);
        setLatitude(coord.lat);
        setLongitude(coord.lng);
        setCenterMap({ lat: coord.lat, lng: coord.lng });
      })
      .catch((error) => {
        console.log('Get place detail error: ', error);
      });
  };

  return (
    <div>
      <div className={classes.search}>
        <GoongAutoComplete
          apiKey={process.env.REACT_APP_GOONG_APIKEY}
          placeholder="Tìm kiếm theo địa chỉ"
          value={autoCompleteValue}
          center={centerMap}
          setValue={setAutoCompleteValue}
          onChange={(place_id) => handleSearch(place_id)}
        />
      </div>
      <div>
        <LoadScript googleMapsApiKey="AIzaSyCaizca2oRuJ43J6xCTcafhZm6BCSYUAM0" libraries={['places']}>
          <GoogleMap
            mapContainerStyle={{ height: '500px', width: '100%' }}
            zoom={13}
            center={initialPosition || { lat: 0, lng: 0 }}
            onClick={handleMapClick}
          >
            {selectedPosition && <Marker position={selectedPosition} />}
            {displayInitialPosition && initialPosition && <Marker position={initialPosition} />}
          </GoogleMap>
        </LoadScript>
        <div className={classes.wrap_btn}>
          <div onClick={() => onClose()} className={classes.btn_map_back}>
            Quay về
          </div>
          <div onClick={() => setModalMap(false)} className={classes.btn_map_choice}>
            Chọn
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coordination;

