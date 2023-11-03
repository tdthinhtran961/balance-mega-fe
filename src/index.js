import React, { Suspense, lazy } from 'react';
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import AuthProvider from 'global';
import { Spin, Message } from 'components';
import Router from 'routes';
import { routerLinks } from 'utils';
import { keyToken, linkApi } from 'variable';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import withClearCache from './clear-cache';
import { UserService } from './services/user';
import { CartProvider } from 'cartContext';

const ClearCacheComponent = withClearCache(Router);

axios.defaults.baseURL = linkApi;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      (!!error.response && !!error.response.data.errors && error.response.data.errors === 401) ||
      error.response.status === 401
    ) {
      window.location.hash = '#' + routerLinks('Login');
    } else if (
      (!!error.response && !!error.response.data.errors && error.response.data.errors === 303) ||
      error.response.status === 303
    ) {
      const originalRequest = error.config;
      await UserService.refreshToken();
      await axios(originalRequest);
      window.location.reload();
    }
    Message.error(error.response.data.message);
    return Promise.reject(error);
  },
);
const token = localStorage.getItem(keyToken);
if (token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
}
i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'en',
    whitelist: ['en', 'vi'],
    interpolation: {
      escapeValue: false,
    },
  });
const Styling = lazy(() => import('styling'));
function App() {
  return (
    <Suspense
      fallback={
        <Spin>
          <div className="w-screen h-screen" />
        </Spin>
      }
    >
      <Styling>
        <AuthProvider>
          <CartProvider>
            <ClearCacheComponent />
          </CartProvider>
        </AuthProvider>
      </Styling>
    </Suspense>
  );
}
const root = createRoot(document.getElementById('root'));
root.render(<App />);
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
