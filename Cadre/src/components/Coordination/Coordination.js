import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import classes from './Coordination.module.scss';
import GoongAutoComplete from '../GoongAutoComplete/index';
import axios from 'axios';

const Coordination = ({ setLatitude, setLongitude, setModalMap, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [autoCompleteValue, setAutoCompleteValue] = useState();

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedPosition({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
  };

  // const performSearch = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         searchTerm
  //       )}&key=AIzaSyCaizca2oRuJ43J6xCTcafhZm6BCSYUAM0`
  //     );
  //     const data = await response.json();
  //     if (data.results && data.results.length > 0) {
  //       const location = data.results[0].geometry.location;
  //       setInitialPosition({ lat: location.lat, lng: location.lng });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching coordinates for search term:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (searchTerm) {
  //     performSearch();
  //   }
  // }, [searchTerm]);

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
      setDisplayMarker(false);
      setCollapseSidebar(true);
      return;
    }

    await axios
      .get(`https://rsapi.goong.io/geocode?place_id=${place_id}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`)
      .then((res) => {
        const coord = res.data.results[0].geometry.location;
        setInitialPosition(coord);
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
            {initialPosition && <Marker position={initialPosition} />}
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

