import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function InputText(props) {
  const { labelInput, register, name, error, defaultValue } = props;

  return (
    <Box sx={{ my: '20px' }}>
      <Typography variant="h5" gutterBottom fontWeight={600} ml={0.2} color="#222222">
        {labelInput}
      </Typography>
      <TextField
        id="outlined-basic"
        label="Nhập thông tin"
        variant="outlined"
        size="small"
        defaultValue={defaultValue}
        error={Boolean(error[name])}
        {...register(name)}
        InputLabelProps={{
          style: { fontSize: '14px' }, // Adjust the font size as needed
        }}
        InputProps={{
          style: { fontSize: '14px' },
        }}
        sx={{
          width: '100%',
          my: '8px',
        }}
      />
    </Box>
  );
}
