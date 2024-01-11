import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { storage } from '~/src/firebase';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { selectFormLicenseReq, selectUser, setFormLicenseReq } from '~/src/store/reducers';
import { convertISOString, notiError } from '~/src/utils/support';
import AsynInputSeletion from './AsynInputSeletion';
import InputText from './InputText';
import classes from './style.module.scss';

const listType = [
  { title: 'Cổ động chính trị', value: 1 },
  { title: 'Quảng cáo thương mại', value: 2 },
  { title: 'Xã hội hoá', value: 3 },
];

const listBoardType = [
  { title: 'Bảng hiflex ốp tường', value: 1 },
  { title: 'Màn hình điện tử ốp tường', value: 2 },
  { title: 'Trung tâm thương mại', value: 3 },
];

const schema = yup.object().shape({
  width: yup.number().typeError('Độ dài bảng quảng cáo phải là số').required('Thông tin bảng quảng cáo chưa đầy đủ!'),
  height: yup.number().typeError('Độ cao quảng cáo phải là số').required('Thông tin bảng quảng cáo chưa đầy đủ!'),
  advertisement_content: yup.string().required('Thông tin bảng quảng cáo chưa đầy đủ!'),
});

const BoardModalUpdate = (props) => {
  const { handleCloseModal, handleReLoadData } = props;
  const axiosPrivate = useAxiosPrivate();

  const selectForm = useSelector(selectFormLicenseReq);
  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const [indexCur, setIndexCur] = useState(1);
  const [previewImage, setPreviewImage] = useState(selectForm?.advertisement_image_url);
  const [imageUploadUrl, setImageUploadUrl] = useState(selectForm?.advertisement_image_url);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleOnChangeTypeAds = (e, value) => {
    if (value) {
      dispatch(setFormLicenseReq({ type: value, point: null }));
    }
  };

  const handleOnChangeTypeBoard = (e, value) => {
    if (value) {
      dispatch(setFormLicenseReq({ board_type_id: value }));
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

    if (!selectForm?.board_type_id) {
      notiError('Lỗi!', 'Chưa có thông của Loại Bảng Quảng Cáo.');
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

      const dataBoard = {
        board_type_id: selectForm.board_type_id.value,
        advertisement_image_url: imageUploadUrl,
        point_id: selectForm?.point.point_id,
        ...dataInput,
      };

      await axiosPrivate.patch(`board/update_board/${selectForm.board_id}`, dataBoard, { headers });

      handleCloseModal(true);
      handleReLoadData();
      reset();
    } catch (error) {
      console.log(error);
      notiError('Lỗi!', 'Thông tin không hợp lệ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.adding__modal__heading}>
            TẠO BẢNG QUẢNG CÁO
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

                  <AsynInputSeletion
                    name="board_type_id"
                    labelInput="Chọn Loại Bảng Quảng Cáo"
                    listItem={listBoardType}
                    handleOnChange={handleOnChangeTypeBoard}
                  />
                  <InputText
                    error={errors}
                    register={register}
                    defaultValue={selectForm.width}
                    name="width"
                    labelInput="Độ Dài Của Bảng Quảng Cáo (đơn vị: m)"
                  />
                  <InputText
                    error={errors}
                    register={register}
                    defaultValue={selectForm.height}
                    name="height"
                    labelInput="Độ Cao Của Bảng Quảng Cáo (đơn vị: m)"
                  />
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
                      defaultValue={selectForm.advertisement_content}
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
              {indexCur < 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setIndexCur(indexCur + 1);
                  }}
                >
                  Tiếp tục
                </button>
              )}

              {indexCur === 2 && (
                <button type="submit" onClick={handleShowError}>
                  Cập Nhật
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

export default BoardModalUpdate;
