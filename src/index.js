import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import 'tailwindcss/tailwind.css';
import App from './App';
import { reduxStore } from './redux/store';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={reduxStore}>
      <App />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
