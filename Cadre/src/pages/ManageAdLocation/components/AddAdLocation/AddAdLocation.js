import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import { Backdrop, CircularProgress } from '@mui/material';
import Coordination from '~/src/components/Coordination/Coordination';
import Modal from '~/src/components/Modal/Modal';
import { storage } from '~/src/firebase';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import classes from './AddAdLocation.module.scss';
import { set } from 'react-hook-form';

const AddAdLocation = ({ onClose, cancel }) => {
  const axiosPrivate = useAxiosPrivate();

  const [indexCur, setIndexCur] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [wards, setWards] = useState([]);
  const [adsType, setAdsType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalMap, setModalMap] = useState(false);
  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [locationType, setLocationType] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [planning, setPlanning] = useState(null);
  const [selectedAdsType, setselectedAdsType] = useState(null);
  const [imageUploadUrl, setImageUploadUrl] = useState(null);

  useEffect(() => {
    axiosPrivate
      .get('cadre/wards')
      .then((response) => {
        setWards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axiosPrivate
      .get('cadre/adsType')
      .then((response) => {
        setAdsType(response.data);
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
          setLoading(true);
          // Tải ảnh lên Firebase
          await uploadBytes(imageRef, file);
          // Lấy URL của ảnh
          const imageUrl = await getDownloadURL(imageRef);
          // Lưu URL vào state hoặc làm bất cứ điều gì bạn muốn
          setImageUploadUrl(imageUrl);
          setLoading(false);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra từng trường dữ liệu và cập nhật errors
    const newErrors = {};

    if (!latitude) {
      newErrors.latitude = 'Vui lòng nhập vĩ độ';
    }

    if (!longitude) {
      newErrors.longitude = 'Vui lòng nhập kinh độ';
    }

    if (!address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!locationType) {
      newErrors.locationType = 'Vui lòng chọn loại điểm đặt';
    }

    if (!selectedWard) {
      newErrors.selectedWard = 'Vui lòng chọn phường';
    }

    if (planning === null) {
      newErrors.planning = 'Vui lòng chọn trạng thái quy hoạch';
    }

    if (!imageUploadUrl) {
      newErrors.imageUploadUrl = 'Vui lòng chọn ảnh';
    }

    if (!selectedAdsType) {
      newErrors.selectedAdsType = 'Vui lòng chọn loại quảng cáo';
    }

    setErrors(newErrors);

    // Nếu có bất kỳ lỗi nào, không tiếp tục với việc submit
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Nội dung còn thiếu. Kiểm tra lại',
        timer: 1500,
      });
      return;
    }

    try {
      const dataToSend = {
        location_type: locationType,
        lng: parseFloat(longitude),
        lat: parseFloat(latitude),
        address,
        ward_id: selectedWard,
        is_planning: planning === 'true',
        image_url: imageUploadUrl,
        advertisement_type_id: selectedAdsType,
      };
      console.log(dataToSend);
      const response = await axiosPrivate.post('/cadre/addAdsPoint', dataToSend);

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Thêm thành công!',
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thêm thất bại!',
          timer: 1500,
          text: 'Có lỗi xảy ra khi thêm nội dung. Vui lòng thử lại.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Thêm thất bại!',
        timer: 1500,
        text: 'Có lỗi xảy ra khi thêm nội dung. Vui lòng thử lại.',
      });
    }
  };

  const handleCloseModalMap = () => {
    setModalMap(false);
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
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div className={classes.flex_left}>
                    <h4>Chọn khu vực:</h4>
                    <select
                      value={selectedWard || ''}
                      onChange={(e) => {
                        setSelectedWard(e.target.value);
                        setErrors((prevErrors) => ({ ...prevErrors, selectedWard: null }));
                      }}
                    >
                      <option value="" disabled>
                        Chọn phường:
                      </option>
                      {wards.map((ward) => (
                        <option key={ward.ward_id} value={ward.ward_id}>
                          {ward.ward_name}, {ward.district_name}
                        </option>
                      ))}
                    </select>
                    {errors.selectedWard && <div style={{ color: 'red' }}>{errors.selectedWard}</div>}

                    <h4>Vĩ độ (Latitude):</h4>
                    <input
                      type="text"
                      placeholder="Nhập vào vĩ độ"
                      value={latitude}
                      onChange={(e) => {
                        setLatitude(e.target.value);
                        setErrors((prevErrors) => ({ ...prevErrors, latitude: null }));
                      }}
                    />
                    {!latitude && <div style={{ color: 'red' }}>{errors.latitude}</div>}

                    <h4>Kinh độ (Longitude):</h4>
                    <input
                      type="text"
                      placeholder="Nhập vào kinh độ"
                      value={longitude}
                      onChange={(e) => {
                        setLongitude(e.target.value);
                        setErrors((prevErrors) => ({ ...prevErrors, longitude: null }));
                      }}
                    />
                    {!longitude && <div style={{ color: 'red' }}>{errors.longitude}</div>}

                    <div onClick={(e) => setModalMap(true)} style={{ marginTop: '10px' }}>
                      <span className={classes.choice_map}>Chọn trên bản đồ</span>
                    </div>
                    <h4>Nhập địa chỉ:</h4>
                    <input
                      type="text"
                      placeholder="Nhập vào địa chỉ"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors((prevErrors) => ({ ...prevErrors, address: null }));
                      }}
                    />
                    {!address && <div style={{ color: 'red' }}>{errors.address}</div>}

                    <h4>Chọn loại vị trí:</h4>
                    <select
                      value={locationType}
                      onChange={(e) => {
                        setLocationType(e.target.value);
                        setErrors((prevErrors) => ({ ...prevErrors, locationType: null }));
                      }}
                    >
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
                    {errors.locationType && <div style={{ color: 'red' }}>{errors.locationType}</div>}
                  </div>
                </div>
              </>
            )}
            {indexCur === 2 && (
              <div>
                <h4>Trạng thái quy hoạch:</h4>
                <select
                  value={planning || ''}
                  onChange={(e) => {
                    setPlanning(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, planning: null }));
                  }}
                >
                  <option value="" disabled>
                    Chọn trạng thái
                  </option>
                  <option value={false}>Chưa quy hoạch</option>
                  <option value={true}>Đã quy hoạch</option>
                </select>
                {errors.planning && <div style={{ color: 'red' }}>{errors.planning}</div>}

                <h4>Hình thức quảng cáo:</h4>
                <select
                  value={selectedAdsType || ''}
                  onChange={(e) => {
                    setselectedAdsType(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, selectedAdsType: null }));
                  }}
                >
                  <option value="" disabled>
                    Chọn hình thức quảng cáo
                  </option>
                  {adsType.map((type) => (
                    <option key={type.advertisement_type_id} value={type.advertisement_type_id}>
                      {type.type_name}
                    </option>
                  ))}
                </select>
                {errors.selectedAdsType && <div style={{ color: 'red' }}>{errors.selectedAdsType}</div>}

                <h4>Chọn hình ảnh:</h4>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                    <p style={{ marginBottom: '10px' }}>Xem trước hình ảnh:</p>
                    <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  </div>
                )}
              </div>
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
            {indexCur === 1 && <button onClick={() => cancel()}>Hủy</button>}
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
        <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      {isModalMap && (
        <Modal>
          <div style={{ width: '40vw', height: '100%' }}>
            <Coordination
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setAddress={setAddress}
              setModalMap={setModalMap}
              onClose={handleCloseModalMap}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddAdLocation;

