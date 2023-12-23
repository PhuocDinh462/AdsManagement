import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import { SocketProvider } from './components/Provider/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <SocketProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </SocketProvider>
    </BrowserRouter>
);

reportWebVitals();
