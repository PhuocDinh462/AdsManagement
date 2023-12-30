import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { v4 } from 'uuid';
import { storage } from '~/src/firebase';
import AsynInputSeletion from './AsynInputSeletion';
import DatePicker from './DatePicker';
import InputText from './InputText';
import classes from './style.module.scss';

const formInput = {
  page1: [{ label: 'Chọn Điểm Quảng Cáo' }, { label: 'Chọn Bảng Quảng Cáo' }],
  page2: [
    { label: 'Tên Công Ty' },
    { label: 'Người Đại Diện' },
    { label: 'Email' },
    { label: 'Mã Số Thuế' },
    { label: 'Số Điện Thoại' },
    { label: 'Địa chỉ' },
  ],
};

const listType = [
  { title: 'Cổ động chính trị', value: 0 },
  { title: 'Quảng cáo thương mại', value: 1 },
  { title: 'Xã hội hoá', value: 2 },
];

const LicenseModalAdd = (props) => {
  const { handleCloseModal } = props;

  const [indexCur, setIndexCur] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const [imageUploadUrl, setImageUploadUrl] = useState(null);

  const [typeAds, setTypeAds] = useState(-1);
  const [pointAds, setPointAds] = useState('');

  const handleOnChangeTypeAds = (e, value) => {
    console.log(value.value);
    setTypeAds(value.value);
  };

  const handleOnChangePointAds = (e, value) => {
    console.log(value);
    // setPointAds(value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);

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
    // const dataToSend = {
    //   lng: longitude,
    //   lat: latitude,
    //   location_type: locationType,
    //   form_ads: advertisingType,
    //   ward_id: selectedWard,
    //   is_planning: planning,
    //   image_url: imageUploadUrl,
    // };
    console.log(dataToSend);
  };
  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <form onSubmit={handleSubmit}>
          <div className={classes.adding__modal__heading}>
            TẠO YÊU CẦU CẤP PHÉP
            <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={handleCloseModal} />
          </div>
          <div className={classes.adding__modal__body}>
            {indexCur === 1 && (
              <>
                <h3>1. Thông Tin Điểm Quảng Cáo</h3>
                <div className={classes['form-block']}>
                  <AsynInputSeletion
                    labelInput="Loại Quảng Cáo"
                    listItem={listType}
                    handleOnChange={handleOnChangeTypeAds}
                  />
                  <AsynInputSeletion
                    labelInput="Chọn Điểm Quảng Cáo"
                    handleOnChange={handleOnChangePointAds}
                    url={`/point/get_point_type/${typeAds}`}
                  />
                  <InputText labelInput="Độ Cao Của Quảng Cáo" />
                  <InputText labelInput="Độ Dài Của Quảng Cáo" />
                </div>
              </>
            )}
            {indexCur === 2 && (
              <>
                <h3>2. Thông Tin Hợp Đồng</h3>
                <div className={`${classes['form-block']} ${classes['flex-center-block']}`}>
                  <div style={{ width: '50%' }}>
                    {formInput.page2.map((item, index) => index % 2 === 0 && <InputText labelInput={item.label} />)}
                    <DatePicker labelInput="Ngày Bắt Đầu" />
                  </div>
                  <div style={{ width: '50%' }}>
                    {formInput.page2.map((item, index) => index % 2 !== 0 && <InputText labelInput={item.label} />)}
                    <DatePicker labelInput="Ngày Kết Thúc" />
                  </div>
                </div>
              </>
            )}

            {indexCur === 3 && (
              <>
                <h3>3. Thông Tin Quảng Cáo</h3>
                <div className={`${classes['form-block']} ${classes['flex-center-block']}`}>
                  <div style={{ width: '50%' }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={600}
                      ml={0.2}
                      color="#222222"
                      sx={{ mt: '20px', mb: '10px' }}
                    >
                      Nội Dung Quảng Cáo
                    </Typography>
                    <textarea placeholder="Nhập thông tin" className={classes['textarea-custom']} />
                  </div>
                  <div style={{ width: '50%' }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={600}
                      ml={0.2}
                      color="#222222"
                      sx={{ mt: '20px', mb: '10px' }}
                    >
                      Hình Ảnh Minh Họa
                    </Typography>
                    <input
                      className={classes['input-custom']}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                        <p style={{ marginBottom: '10px' }}>Xem trước hình ảnh:</p>
                        <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={classes.adding__modal__action}>
            <div className={classes.adding__modal__line}>
              {[1, 2, 3].map((index) => (
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
              {indexCur === 1 && <button onClick={handleCloseModal}>Hủy</button>}
              {indexCur > 1 && (
                <button
                  onClick={() => {
                    setIndexCur(indexCur - 1);
                  }}
                >
                  Quay lại
                </button>
              )}
              {indexCur === 2 && <button>Đăng ký</button>}
              {indexCur < 3 && (
                <button
                  onClick={() => {
                    setIndexCur(indexCur + 1);
                  }}
                >
                  Tiếp tục
                </button>
              )}

              {indexCur === 3 && <button type="submit">Tạo Yêu Cầu</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseModalAdd;
