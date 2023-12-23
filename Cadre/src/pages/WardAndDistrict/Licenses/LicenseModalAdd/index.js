import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './style.module.scss';
import { storage } from '~/src/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import AsynInput from './AsynInput';
import { ExampleComponentUseSocket } from '~/src/hook/useSocketSubscribe';

const formInput = {
  page1: [{ label: 'Chọn Điểm Quảng Cáo' }, { label: 'Chọn Bảng Quảng Cáo' }],
};

const LicenseModalAdd = () => {
  const [indexCur, setIndexCur] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const [planning, setPlanning] = useState(null);
  const [imageUploadUrl, setImageUploadUrl] = useState(null);

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
      <ExampleComponentUseSocket />
      <div className={classes.adding__modal}>
        <form onSubmit={handleSubmit}>
          <div className={classes.adding__modal__heading}>
            TẠO YÊU CẦU CẤP PHÉP
            <FontAwesomeIcon
              icon={faClose}
              className={classes['adding__modal-ic']}
              //  onClick={props.onClose}
            />
          </div>
          <div className={classes.adding__modal__body}>
            {indexCur === 1 && (
              <>
                {formInput.page1.map((item) => (
                  <AsynInput labelInput={item.label} />
                ))}
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
            {indexCur === 1 && (
              <button
              //  onClick={props.onClose}
              >
                Hủy
              </button>
            )}
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

export default LicenseModalAdd;
