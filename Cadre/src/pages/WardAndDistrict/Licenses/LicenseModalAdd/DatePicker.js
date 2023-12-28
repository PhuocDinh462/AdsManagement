import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Typography } from '@mui/material';

export default function BaseDatePicker(props) {
  const { labelInput } = props;
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} ml={0.2} color="#222222">
        {labelInput}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label=""
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
  );
}
