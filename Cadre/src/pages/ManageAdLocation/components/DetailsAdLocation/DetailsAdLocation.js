import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './DetailsAdLocation.module.scss';

const DetailsAdLocation = ({ data, onClose }) => {
  const apiKey = 'AIzaSyCFjMz64uEI7tL_FMVpawPirJJKE5VQtzU';
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.lat},${data.lng}&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log(result);

        if (result.status === 'OK' && result.results.length > 0) {
          const detailedAddress = result.results[0].formatted_address;
          setAddress(detailedAddress);
        } else {
          setAddress('Không có địa chỉ được tìm thấy');
        }
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        setAddress('Lỗi khi lấy địa chỉ');
      }
    };

    fetchData();
  }, [data.lat, data.lng, apiKey]);

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <div className={classes.adding__modal__heading}>
          CHI TIẾT ĐIỂM ĐẶT
          <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={onClose} />
        </div>
        <ul>
          <li>
            <strong>Khu vực &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>:
            <span>
              {' '}
              {data.ward_name} - {data.district_name}
            </span>
          </li>

          <li>
            <strong>
              Tọa độ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>
            :
            <span>
              {' '}
              {data.lat},{data.lng}
            </span>
          </li>
          <li>
            <strong>
              Địa chỉ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>
            : {address}
          </li>
          <li>
            <strong>Loại vị trí &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>:{' '}
            {data.location_type}
          </li>
          <li>
            <strong>Hình thức quảng cáo &nbsp;&nbsp;</strong>: {data.advertisement_type_name}
          </li>
          <li>
            <strong>Trạng thái quy hoạch &nbsp;&nbsp;</strong>:{' '}
            <span style={{ color: data.is_planning === 0 ? 'red' : 'green' }}>
              {data.is_planning === 0 ? 'Chưa quy hoạch' : 'Đã quy hoạch'}
            </span>
          </li>
          <li>
            <strong>Hình ảnh</strong>:
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px 0' }}>
              <img src={data.image_url} alt="Preview" style={{ maxWidth: '400px', maxHeight: '350px' }} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsAdLocation;

