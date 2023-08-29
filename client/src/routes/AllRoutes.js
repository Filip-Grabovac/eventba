import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing } from '../pages/landing/Landing';
import SinglePage from '../pages/single-page/SinglePage';
import { Profile } from '../pages/profile-page/Profile';
import { ProtectedRoute } from './ProtectedRoutes';
import { BuyPage } from '../pages/buy/BuyPage';
import { ThankYou } from '../pages/payment-result-page/ThankYou';
import { Failed } from '../pages/payment-result-page/Failed';
import { Verification } from '../auth/Verification';
import { QRscanner } from '../pages/entrance-controller/QRscanner';
import { ProtectedControllerRoute } from './ProtectedControllerRoute';
import { EntranceControllerLogin } from '../pages/entrance-controller/EntranceControllerLogin';
import { ListPage } from '../pages/list-page/ListPage';
import { OverallInfo } from '../pages/overall-info-pages/OverallInfo';
import { ErrorPage } from '../components/ErrorPage';
import { DrawPlace } from '../pages/draw-place/DrawPlace';

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Landing />} />

        <Route path="/single" element={<SinglePage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/buy" element={<BuyPage />} />
        <Route
          path="/thankyou"
          element={
            <ProtectedRoute>
              <ThankYou />
            </ProtectedRoute>
          }
        />
        <Route
          path="/failed"
          element={
            <ProtectedRoute>
              <Failed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify/:verificationCode"
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          }
        />
        <Route path="/informations" element={<OverallInfo />} />
        <Route
          path="/draw"
          element={
            <ProtectedRoute>
              <DrawPlace />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <ErrorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr_scanner"
          element={
            <ProtectedControllerRoute>
              <QRscanner />
            </ProtectedControllerRoute>
          }
        />
        <Route path="/controller_login" element={<EntranceControllerLogin />} />
        <Route path="/list_page" element={<ListPage />} />
      </Routes>
    </div>
  );
};
