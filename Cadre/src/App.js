import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/style.scss';

import Navigation from './routes';

const theme = createTheme({
  components: {},
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Navigation />
    {/* <AlertNotification /> */}
  </ThemeProvider>
);

export default App;
