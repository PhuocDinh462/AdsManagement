import classes from './styles.module.scss';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors, text } from '~styles/colors';
import { IconTextBtn } from '~components/button';
import { useState } from 'react';
import { Backdrop, CircularProgress, styled, TextField, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectSendMailStatus, setSendMailStatus } from '~/src/store/reducers';

const fontSize = 16;
const sx = { '& .MuiSvgIcon-root': { fontSize: 18, color: colors.primary_200 } };

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})((p) => ({
  // input label when focused
  '& label.Mui-focused': {
    color: p.focusColor,
  },
  // focused color for input with variant='standard'
  '& .MuiInput-underline:after': {
    borderBottomColor: p.focusColor,
  },
  // focused color for input with variant='filled'
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: p.focusColor,
  },
  // focused color for input with variant='outlined'
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: p.focusColor,
    },
  },
  // Label
  '& .MuiFormLabel-root': {
    fontSize: fontSize,
  },
}));

export default function StatusModal(props) {
  const axiosPrivate = useAxiosPrivate();
  const { setActive, report_id, changeStatusByReportId, currentReport } = props;
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [handlingMethod, setHandlingMethod] = useState('');

  const sendMailStatus = useSelector(selectSendMailStatus);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleConfirm = async () => {
    setLoading(true);
    const body = {
      id: report_id,
      status: selectedStatus,
      handlingMethod: handlingMethod,
      sendMail: sendMailStatus,
    };
    await axiosPrivate
      .patch(`ward/updateReportStatus`, body)
      .then((res) => {
        setActive(false);
        changeStatusByReportId(report_id, options.find((item) => item.value === selectedStatus).label);
        Swal.fire({
          icon: 'success',
          title: 'Thông báo',
          text: 'Cập nhật trạng thái thành công',
          width: '50rem',
          confirmButtonColor: colors.primary_300,
        });
      })
      .catch((error) => {
        console.log('Update report status error: ');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const borderColor = text.color_300;
  const borderColorFocus = colors.primary_300;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '70rem',
      borderColor: state.isFocused ? borderColorFocus : borderColor,
      boxShadow: state.isFocused ? `0 0 0 1px ${borderColorFocus}` : 'none',
      '&:hover': {
        borderColor: borderColorFocus,
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: text.color_800,
    }),
  };

  const options = [
    {
      value: 'pending',
      label: 'Chờ xử lý',
    },
    {
      value: 'processing',
      label: 'Đang xử lý',
    },
    {
      value: 'processed',
      label: 'Đã xử lý',
    },
  ];

  const findDefaultValueIndex = () => {
    if (!currentReport) return 0;
    return options.findIndex((item) => item.label === currentReport.status);
  };

  return (
    <div className={classes.main_container}>
      <div className={classes.header}>
        <div className={classes.header__title}>Cập nhật trạng thái</div>
        <div className={classes.header__closeIc} onClick={() => setActive(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>

      <div className={classes.content}>
        <Select
          defaultValue={options[findDefaultValueIndex()]}
          options={options}
          styles={customStyles}
          onChange={(e) => setSelectedStatus(e.value)}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: colors.primary_200,
              primary: colors.primary_300,
            },
          })}
        />

        <div className={classes.textField}>
          <CssTextField
            defaultValue={currentReport.processing_info}
            variant="outlined"
            label="Cách thức xử lý"
            fullWidth
            multiline
            rows={10}
            InputProps={{ style: { fontSize: fontSize } }}
            focusColor={colors.primary_300}
            onChange={(event) => setHandlingMethod(event.target.value)}
          />
        </div>

        <div className={classes.checkbox_container}>
          <div className={classes.checkbox}>
            <Checkbox
              defaultChecked={sendMailStatus}
              className={classes.checkbox__ic}
              sx={sx}
              onChange={(e) => {
                dispatch(setSendMailStatus(e.target.checked));
              }}
            />
            <div className={classes.checkbox__label}>Gửi mail cho người báo cáo</div>
          </div>
        </div>
      </div>

      <div className={classes.btn_container}>
        <IconTextBtn label="Cập nhật" width="13rem" rightIc={faCheck} onClick={() => handleConfirm()} />
      </div>

      <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
