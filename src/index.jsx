import 'babel-polyfill';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Routes, Route } from 'react-router-dom';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage, AuthenticatedPageRoute } from '@edx/frontend-platform/react';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import messages from './i18n';
import './index.scss';
import ProgramRecordsList from './components/ProgramRecordsList';
import ProgramRecord from './components/ProgramRecord';
import CertificatesList from './components/CertificatesList';
import Head from './components/Head';
import { ROUTES } from './constants';

const rootNode = createRoot(document.getElementById('root'));

subscribe(APP_READY, () => {
  rootNode.render(
    <StrictMode>
      <AppProvider>
        <HelmetProvider>
          <Head />
          <Header />
          <Routes>
            <Route
              path={ROUTES.PROGRAM_RECORDS}
              element={<AuthenticatedPageRoute><ProgramRecordsList /></AuthenticatedPageRoute>}
            />
            <Route
              path={ROUTES.PROGRAM_RECORD_SHARED}
              element={<ProgramRecord isPublic />}
            />
            <Route
              path={ROUTES.PROGRAM_RECORD_ITEM}
              element={<AuthenticatedPageRoute><ProgramRecord isPublic={false} /></AuthenticatedPageRoute>}
            />
            {getConfig().ENABLE_VERIFIABLE_CREDENTIALS && (
            <Route
              path={ROUTES.VERIFIABLE_CREDENTIALS}
              element={<AuthenticatedPageRoute><CertificatesList /></AuthenticatedPageRoute>}
            />
            )}
          </Routes>
          <FooterSlot />
        </HelmetProvider>
      </AppProvider>
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />);
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL_LEARNER_RECORDS: process.env.SUPPORT_URL_LEARNER_RECORDS || '',
        ENABLE_VERIFIABLE_CREDENTIALS: process.env.ENABLE_VERIFIABLE_CREDENTIALS || false,
        SUPPORT_URL_VERIFIABLE_CREDENTIALS: process.env.SUPPORT_URL_VERIFIABLE_CREDENTIALS || '',
      }, 'LearnerRecordConfig');
    },
  },
  messages,
});
