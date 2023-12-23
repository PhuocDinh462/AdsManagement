import React from 'react';
import './styles/style.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Navigation from './routes';

const theme = createTheme({
  components: {},
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Navigation />
  </ThemeProvider>
);

export default App;
