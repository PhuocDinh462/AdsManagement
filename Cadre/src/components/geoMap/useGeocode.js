import { useState, useEffect } from 'react';
import axios from 'axios';

const useGeocode = (lat, lng, apiKey) => {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'OK' && result.results.length > 0) {
          const detailedAddress = result.results[0].formatted_address;
          setAddress(detailedAddress);
          console.log(detailedAddress);
        } else {
          setAddress('Không có địa chỉ được tìm thấy');
        }
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        setAddress('Lỗi khi lấy địa chỉ');
      }
    };

    fetchData();
  }, [lat, lng, apiKey]);

  return address;
};

export default useGeocode;

