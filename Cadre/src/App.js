import React from 'react';
import './styles/style.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Navigation from './routes';
import { AlertNotification } from '~/src/hook/useSocketSubscribe';

const theme = createTheme({
  components: {},
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Navigation />
    <AlertNotification />
  </ThemeProvider>
);

export default App;
