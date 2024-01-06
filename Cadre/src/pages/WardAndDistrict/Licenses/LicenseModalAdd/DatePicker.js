import { Box, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFormLicenseReq, setFormLicenseReq } from '~/src/store/reducers';

export default function BaseDatePicker(props) {
  const { labelInput, name } = props;
  const selectForm = useSelector(selectFormLicenseReq);
  const dispatch = useDispatch();
  const [defaultCompleted, setDefaultCompleted] = useState(false);
  const [defaultVa, setDefaultVa] = useState();

  useEffect(() => {
    setDefaultCompleted(true);
    setDefaultVa(selectForm && selectForm.hasOwnProperty(name) ? dayjs(selectForm[name]) : dayjs(new Date()));
  }, []);
  return (
    defaultCompleted && (
      <Box>
        <Typography variant="h5" gutterBottom fontWeight={600} ml={0.2} color="#222222">
          {labelInput}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label=""
              onChange={(newValue) => {
                console.log(newValue?.toISOString());
                dispatch(setFormLicenseReq({ [name]: newValue?.toISOString() }));
              }}
              defaultValue={defaultVa}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small',
                  InputLabelProps: {
                    style: { fontSize: '14px' }, // Adjust the font size as needed
                  },
                  InputProps: {
                    style: { fontSize: '14px' },
                  },
                  sx: {
                    width: '100%',
                  },
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
    )
  );
}
