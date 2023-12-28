// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// const Coordination = ({ setLatitude, setLongitude }) => {
//   const [selectedPosition, setSelectedPosition] = useState(null);
//   const [initialPosition, setInitialPosition] = useState(null);

//   const handleMapClick = (e) => {
//     const { latLng } = e;
//     const lat = latLng.lat();
//     const lng = latLng.lng();

//     setSelectedPosition({ lat, lng });
//     setLatitude(lat);
//     setLongitude(lng);
//   };
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setInitialPosition({ lat: latitude, lng: longitude });
//       },
//       (error) => {
//         console.error('Error getting geolocation:', error);
//       }
//     );
//   }, []);

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyCaizca2oRuJ43J6xCTcafhZm6BCSYUAM0" libraries={['places']}>
//       <GoogleMap
//         mapContainerStyle={{ height: '400px', width: '100%' }}
//         zoom={13}
//         center={initialPosition || { lat: 0, lng: 0 }}
//         onClick={handleMapClick}
//       >
//         {selectedPosition && <Marker position={selectedPosition} />}
//         {initialPosition && <Marker position={initialPosition} />}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default Coordination;

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Coordination = ({ setLatitude, setLongitude, searchTerm, setModalMap }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedPosition({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
  };

  const performSearch = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchTerm
        )}&key=AIzaSyCaizca2oRuJ43J6xCTcafhZm6BCSYUAM0`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setInitialPosition({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Error fetching coordinates for search term:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm]);

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

  return (
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
      <div onClick={() => setModalMap(false)}>Chọn</div>
    </div>
  );
};

export default Coordination;

