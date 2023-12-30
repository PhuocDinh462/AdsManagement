import classes from './styles.module.scss';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors, text } from '~styles/colors';
import { IconTextBtn } from '~components/button';
import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { axiosRequest } from '~/src/api/axios';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { selectUser } from '~/src/store/reducers';

export default function StatusModal(props) {
  const { setActive, report_id, changeStatusByReportId, reportList } = props;
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('pending');

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
    };
    await axiosRequest
      .patch(`ward/updateReportStatus`, body, { headers: headers })
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
    const report = reportList?.find((item) => item.report_id === report_id);
    if (!report) return 0;
    return options.findIndex((item) => item.label === report.status);
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
      </div>

      <div className={classes.btn_container}>
        <IconTextBtn label="Cập nhật" rightIc={faCheck} onClick={() => handleConfirm()} />
      </div>

      <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
