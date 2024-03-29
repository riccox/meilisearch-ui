import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/global.css';
import './utils/i18n';
import { AppProvider } from '@/src/providers';
import { AppRoutes } from '@/src/routes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>
);
