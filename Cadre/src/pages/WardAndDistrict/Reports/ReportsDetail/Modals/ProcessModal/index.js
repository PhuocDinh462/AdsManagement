import classes from './styles.module.scss';
import { faXmark, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '~styles/colors';
import { IconTextBtn } from '~components/button';
import { useState } from 'react';
import { Backdrop, CircularProgress, styled, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { useSelector } from 'react-redux';
import { selectUser } from '~/src/store/reducers';

const fontSize = 16;

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

export default function ProcessModal(props) {
  const axiosPrivate = useAxiosPrivate();
  const { setActive, email } = props;
  const [loading, setLoading] = useState(false);
  const [handlingMethod, setHandlingMethod] = useState('');

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleConfirm = async () => {
    setLoading(true);
    const body = {
      email: email,
      content: handlingMethod,
    };
    await axiosPrivate
      .post(`ward/replyReport`, body)
      .then((res) => {
        setActive(false);
        Swal.fire({
          icon: 'success',
          title: 'Thông báo',
          text: 'Gửi thành công',
          width: '50rem',
          confirmButtonColor: colors.primary_300,
        });
      })
      .catch((error) => {
        console.log('Send email error: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={classes.main_container}>
      <div className={classes.header}>
        <div className={classes.header__title}>Gửi mail</div>
        <div className={classes.header__closeIc} onClick={() => setActive(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>

      <div className={classes.content}>
        <div className={classes.textField}>
          <CssTextField
            defaultValue={null}
            variant="outlined"
            label={'Nội dung'}
            fullWidth
            multiline
            rows={10}
            InputProps={{ style: { fontSize: fontSize } }}
            focusColor={colors.primary_300}
            onChange={(event) => setHandlingMethod(event.target.value)}
          />
        </div>
      </div>

      <div className={classes.btn_container}>
        <IconTextBtn
          label="Gửi"
          width="13rem"
          rightIc={faShare}
          onClick={() => handleConfirm()}
          disabled={!handlingMethod}
        />
      </div>

      <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
