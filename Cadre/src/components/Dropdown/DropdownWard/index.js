import classes from './styles.module.scss';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import request from '~/src/utils/request';
import { colors } from '~styles/colors';
import { selectSelectedWards, setSelectedWards } from '~/src/store/reducers';

const sx = { '& .MuiSvgIcon-root': { fontSize: 18, color: colors.primary_200 } };

export default function DropdownWard(props) {
  const dispatch = useDispatch()
  const selectedWards = useSelector(selectSelectedWards)
  const [wards, setWards] = useState([])
  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };
  const fetchWards = async () => {
    try {
      const res = await request('/ward/get_wards_managing', { headers: headers })
      setWards(res.data.wards)
    } catch (error) {
      console.log("Error fetching data: " + error.message)
    }
  }

  useEffect(() => {
    fetchWards();
  }, [])
  const handleSelected = (ward) => (e) => {
    if (e.target.checked) {
      // Dispatch action to add ward to selectedWards in Redux store
      dispatch(setSelectedWards([...selectedWards, ward]));
    } else {
      // Dispatch action to remove ward from selectedWards in Redux store
      dispatch(setSelectedWards(selectedWards.filter((selectedWard) => selectedWard.ward_id !== ward.ward_id)));
    }
  };
  const checkedSelected = (ward) => {
    const checked = selectedWards.some((selected) => selected.ward_id === ward.ward_id)
    return checked;

  }
  return (
    <div className={classes.main_container}>
      <div className={classes.title}>Chọn phường</div>
      <div className={classes.filterItem}>
        {wards.map((ward) => (
          <div key={ward.ward_id} className={classes.checkbox}>
            <Checkbox
              checked={checkedSelected(ward)}
              className={classes.checkbox__ic}
              sx={sx}
              onChange={handleSelected(ward)}
            />
            <div className={classes.checkbox__label}>{ward.ward_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
