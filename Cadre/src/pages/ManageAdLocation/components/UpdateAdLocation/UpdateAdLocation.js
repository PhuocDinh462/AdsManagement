import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './UpdateAdLocation.module.scss';
import { axiosClient } from '../../../../api/axios';
import Swal from 'sweetalert2';
import { storage } from '~/src/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const UpdateAdLocation = ({ data, onClose }) => {
  const [indexCur, setIndexCur] = useState(1);
  const [wards, setWards] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [locationType, setLocationType] = useState('');
  const [advertisingType, setAdvertisingType] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [planning, setPlanning] = useState(null);
  const [imageUploadUrl, setImageUploadUrl] = useState(null);

  useEffect(() => {
    axiosClient
      .get('cadre/wards')
      .then((response) => {
        setWards(response);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreviewImage(reader.result);

        const imageRef = ref(storage, `images/${file.name + v4()}`);

        try {
          // Tải ảnh lên Firebase
          await uploadBytes(imageRef, file);
          // Lấy URL của ảnh
          const imageUrl = await getDownloadURL(imageRef);
          // Lưu URL vào state hoặc làm bất cứ điều gì bạn muốn
          setImageUploadUrl(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUploadUrl === null) {
      console.log('Vui lòng chờ');
      return;
    }
    const dataToSend = {
      lng: longitude,
      lat: latitude,
      location_type: locationType,
      form_ads: advertisingType,
      ward_id: selectedWard,
      is_planning: planning,
      image_url: imageUploadUrl,
    };
    console.log(dataToSend);
  };

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <form onSubmit={handleSubmit}>
          <div className={classes.adding__modal__heading}>
            THÊM ĐIỂM ĐẶT QUẢNG CÁO
            <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={onClose} />
          </div>
          <div className={classes.adding__modal__body}>
            {indexCur === 1 && (
              <>
                <h4>Vĩ độ (Latitude)</h4>
                <input
                  type="text"
                  placeholder="Nhập vào vĩ độ"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
                <h4>Kinh độ (Longitude)</h4>
                <input
                  type="text"
                  placeholder="Nhập vào kinh độ"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
                <h4>Chọn loại vị trí</h4>
                <select value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                  <option value="" disabled>
                    Chọn loại vị trí
                  </option>
                  <option value={'Đất công/Công viên/Hành lang an toàn giao thông'}>
                    Đất công/Công viên/Hành lang an toàn giao thông
                  </option>
                  <option value={'Đất tư nhân/Nhà ở riêng lẻ'}> Đất tư nhân/Nhà ở riêng lẻ</option>
                  <option value={'Trung tâm thương mại'}>Trung tâm thương mại</option>
                  <option value={'Chợ'}>Chợ</option>
                  <option value={'Cây xăng'}>Cây xăng</option>
                  <option value={'Nhà chờ xe buýt'}>Nhà chờ xe buýt</option>
                </select>
                <h4>Chọn hình thức quảng cáo</h4>
                <select value={advertisingType} onChange={(e) => setAdvertisingType(e.target.value)}>
                  <option value="" disabled>
                    Chọn hình thức quảng cáo
                  </option>
                  <option value={'Cổ động chính trị'}>Cổ động chính trị</option>
                  <option value={'Quảng cáo thương mại'}>Quảng cáo thương mại</option>
                  <option value={'Quảng cáo thương mại'}>Xã hội hoá</option>
                </select>

                <h4>Chọn quận</h4>
                <select value={selectedWard || ''} onChange={(e) => setSelectedWard(e.target.value)}>
                  <option value="" disabled>
                    Chọn quận
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.ward_id} value={ward.ward_id}>
                      {ward.ward_name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {indexCur === 2 && (
              <>
                <h4>Trạng thái quy hoạch</h4>
                <select value={planning || ''} onChange={(e) => setPlanning(e.target.value)}>
                  <option value="" disabled>
                    Chọn trạng thái
                  </option>
                  <option value={false}>Chưa quy hoạch</option>
                  <option value={true}>Đã quy hoạch</option>
                </select>
                <h4>Chọn hình ảnh</h4>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                    <p style={{ marginBottom: '10px' }}>Xem trước hình ảnh:</p>
                    <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={classes.adding__modal__line}>
            {[1, 2].map((index) => (
              <div
                key={index}
                className={classes['modal__line-item']}
                style={{
                  backgroundColor: index === indexCur ? '#0A6971' : '',
                }}
              />
            ))}
          </div>
          <div className={classes.adding__modal__buttons}>
            {indexCur === 1 && <button onClick={onClose}>Hủy</button>}
            {indexCur === 2 && (
              <button
                onClick={() => {
                  setIndexCur(1);
                }}
              >
                Quay lại
              </button>
            )}
            {indexCur === 1 && (
              <button
                onClick={() => {
                  setIndexCur(2);
                }}
              >
                Tiếp tục
              </button>
            )}
            {indexCur === 2 && <button>Thêm</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdLocation;

