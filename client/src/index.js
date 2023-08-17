import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../src/style.css';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { ScrollToTop } from './components/helper/scrollToTop';
import { store } from './store/store';
import { I18nextProvider } from 'react-i18next';
import './functions/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <I18nextProvider>
        <App />
      </I18nextProvider>
    </Router>
  </Provider>
);
