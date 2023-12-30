import { Box, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { axiosClient } from '~/src/api/axios';

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function AsynInputSeletion(props) {
  const { labelInput, handleOnChange, listItem, url } = props;

  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      // await sleep(1e3); // For demo purposes.
      let list = listItem ? [...listItem] : [];
      if (!listItem) {
        console.log(url);
        const response = await axiosClient.get(url, { headers });
        list = [...response.data];
        console.log(list);
      }
      if (active) {
        setOptions([...list]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Box sx={{ my: '20px' }}>
      <Typography variant="h5" gutterBottom fontWeight={600} ml={0.2} color="#222222">
        {labelInput}
      </Typography>
      <Autocomplete
        id="asynchronous-demo"
        sx={{
          width: '100%',
          my: '8px',
        }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        onChange={handleOnChange}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Lựa chọn"
            InputLabelProps={{
              style: { fontSize: '14px' }, // Adjust the font size as needed
            }}
            InputProps={{
              ...params.InputProps,
              style: { fontSize: '14px' },
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} sx={{ fontSize: '16px' }} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}
