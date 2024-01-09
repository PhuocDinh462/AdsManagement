import { Box, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from '~/src/api/axios';
import { selectFormLicenseReq, selectUser } from '~/src/store/reducers';

export default function AsynInputSeletion(props) {
  const { labelInput, handleOnChange, listItem, name } = props;

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const [defaultCompleted, setDefaultCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const selectForm = useSelector(selectFormLicenseReq);
  const [defaultVa, setDefaultVa] = useState();

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      let list = listItem ? [...listItem] : [];
      if (!listItem) {
        try {
          const response = await axiosClient.get(`/point/get_point_type/candre/${selectForm?.type?.value}`, {
            headers,
          });
          if (response.data.length === 0) list.push({ title: 'Trống' });
          else
            list = response.data.map((item) => {
              return { ...item, title: item.address };
            });

          console.log(list);
        } catch (error) {
          console.log(error);
          list.push({ title: 'Trống' });
        }
      }
      if (active) {
        setOptions([...list]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    setDefaultCompleted(true);
    setDefaultVa(selectForm && selectForm.hasOwnProperty(name) ? selectForm[name] : null);
  }, []);

  return (
    defaultCompleted && (
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
          defaultValue={defaultVa}
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
    )
  );
}
