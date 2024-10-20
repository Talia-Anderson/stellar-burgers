import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Подключаем Provider для Redux
import store from './services/store'; // Импортируем store
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
