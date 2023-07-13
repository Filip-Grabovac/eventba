import React from "react";
import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/landing/Landing";
import SinglePage from "../pages/single-page/SinglePage";
import { Profile } from "../pages/profile-page/Profile";
import { ProtectedRoute } from "./ProtectedRoutes";
import { BuyPage } from "../pages/buy/BuyPage";
import { ThankYou } from "../pages/paymentResult-page/ThankYou";
import { Failed } from "../pages/paymentResult-page/Failed";
import { Verification } from "../auth/Verification";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Landing />} />

        <Route path="/single" element={<SinglePage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buy"
          element={
            <ProtectedRoute>
              <BuyPage />
            </ProtectedRoute>
          }
        />
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
      </Routes>
    </div>
  );
};
