import React from 'react';
import './styles/style.scss';

import Navigation from './routes';
import { AlertNotification } from './hook/useSocketSubscribe';

const App = () => (
    <div>
        <AlertNotification />

        <Navigation />
    </div>
);

export default App;
