import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { axiosClient } from '~/src/api/axios';
import { storage } from '~/src/firebase';
import { selectFormLicenseReq, selectUser, setFormLicenseReq } from '~/src/store/reducers';
import { convertISOString } from '~/src/utils/support';
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
  { title: 'Cổ động chính trị', value: 1 },
  { title: 'Quảng cáo thương mại', value: 2 },
  { title: 'Xã hội hoá', value: 3 },
];

const schema = yup.object().shape({
  company_name: yup.string().required('Thông tin hợp đồng chưa đầy đủ!'),
  company_email: yup.string().required('Thông tin hợp đồng chưa đầy đủ!'),
  company_phone: yup.string().required('Thông tin hợp đồng chưa đầy đủ!'),
  representative: yup.string().required('Thông tin hợp đồng chưa đầy đủ!'),
  company_taxcode: yup.number().typeError('Mã số thuể phải là số').required('Thông tin hợp đồng chưa đầy đủ!'),
  company_address: yup.string().required('Thông tin hợp đồng chưa đầy đủ!'),
  width: yup.number().typeError('Độ dài bảng quảng cáo phải là số').required('Thông tin bảng quảng cáo chưa đầy đủ!'),
  height: yup.number().typeError('Độ cao quảng cáo phải là số').required('Thông tin bảng quảng cáo chưa đầy đủ!'),
  advertisement_content: yup.string().required('Thông tin bảng quảng cáo chưa đầy đủ!'),
});

const LicenseModalAdd = (props) => {
  const { handleCloseModal } = props;

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const [indexCur, setIndexCur] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUploadUrl, setImageUploadUrl] = useState(null);
  const selectForm = useSelector(selectFormLicenseReq);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleOnChangeTypeAds = (e, value) => {
    if (value) {
      console.log(value.value);
      dispatch(setFormLicenseReq({ type: value, point: null }));
    }
  };

  const handleOnChangePointAds = (e, value) => {
    console.log(value);
    dispatch(setFormLicenseReq({ point: value }));
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

  const handleShowError = () => {
    const keys = Object.keys(errors);
    console.log(errors);
    if (keys.length > 0) {
      notiError('Thông tin không hợp lệ!', errors[keys[0]].message);
    }
  };

  const onSubmit = async (dataInput) => {
    // console.log(dataInput, selectForm);

    if (!imageUploadUrl) {
      notiError('Lỗi!', 'Ảnh đang được tải lên, vui lòng chờ trong giây lát...');
      return;
    }

    if (!selectForm?.type) {
      notiError('Lỗi!', 'Chưa có thông của Loại Quảng Cáo.');
      return;
    }

    if (!selectForm?.point) {
      notiError('Lỗi!', 'Chưa có thông của Điểm Quảng Cáo.');
      return;
    }

    if (selectForm.start_date >= selectForm.end_date) {
      notiError('Lỗi!', 'Thời hạn hợp đồng không hợp lệ.');
      return;
    }

    setIsLoading(true);

    try {
      const dataContract = {
        ...dataInput,
        start_date: convertISOString(selectForm.start_date),
        end_date: convertISOString(selectForm.end_date),
      };
      const res1 = await axiosClient.post('/contract/create', dataContract, { headers });

      const dataLicense = {
        ...dataInput,
        status: 'pending',
        point_id: selectForm?.point.point_id,
        contract_id: res1.data.contract_id,
        advertisement_image_url: imageUploadUrl,
      };
      const res2 = await axiosClient.post('/ward/license/create-license', dataLicense, { headers });

      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      handleCloseModal(true);
    }
  };

  const notiError = (title, content) => {
    Swal.fire({
      icon: 'error',
      title: `${title}`,
      text: `${content}`,
    });
  };

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    name="type"
                    labelInput="Loại Quảng Cáo"
                    listItem={listType}
                    handleOnChange={handleOnChangeTypeAds}
                  />
                  <AsynInputSeletion
                    name="point"
                    labelInput="Chọn Điểm Quảng Cáo"
                    handleOnChange={handleOnChangePointAds}
                  />
                  <InputText
                    error={errors}
                    register={register}
                    name="width"
                    labelInput="Độ Dài Của Bảng Quảng Cáo (đơn vị: m)"
                  />
                  <InputText
                    error={errors}
                    register={register}
                    name="height"
                    labelInput="Độ Cao Của Bảng Quảng Cáo (đơn vị: m)"
                  />
                </div>
              </>
            )}
            {indexCur === 3 && (
              <>
                <h3>3. Thông Tin Hợp Đồng</h3>
                <div className={`${classes['form-block']} ${classes['flex-center-block']}`}>
                  <div style={{ width: '50%' }}>
                    <InputText error={errors} register={register} name="company_name" labelInput="Tên Công Ty" />
                    <InputText error={errors} register={register} name="company_email" labelInput="Email" />
                    <InputText error={errors} register={register} name="company_phone" labelInput="Số Điện Thoại" />
                    <DatePicker error={errors} setValue={setValue} name="start_date" labelInput="Ngày Bắt đầu" />
                  </div>
                  <div style={{ width: '50%' }}>
                    <InputText error={errors} register={register} name="representative" labelInput="Người Đại Diện" />
                    <InputText error={errors} register={register} name="company_taxcode" labelInput="Mã Số Thuế" />
                    <InputText error={errors} register={register} name="company_address" labelInput="Địa chỉ" />
                    <DatePicker error={errors} setValue={setValue} name="end_date" labelInput="Ngày Kết Thúc" />
                  </div>
                </div>
              </>
            )}

            {indexCur === 2 && (
              <>
                <h3>2. Thông Tin Quảng Cáo</h3>
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
                    <textarea
                      {...register('advertisement_content')}
                      placeholder="Nhập thông tin"
                      className={classes['textarea-custom']}
                    />
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
                  type="button"
                  onClick={() => {
                    setIndexCur(indexCur - 1);
                  }}
                >
                  Quay lại
                </button>
              )}
              {indexCur < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setIndexCur(indexCur + 1);
                  }}
                >
                  Tiếp tục
                </button>
              )}

              {indexCur === 3 && (
                <button type="submit" onClick={handleShowError}>
                  Tạo Yêu Cầu
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default LicenseModalAdd;
