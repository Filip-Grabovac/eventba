import React from "react";
import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/landing/Landing";
import SinglePage from "../pages/single-page/SinglePage";
import { Profile } from "../pages/profile-page/Profile";
import { ProtectedRoute } from "./ProtectedRoutes";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Landing />} />

        <Route
          path="/single"
          element={
            <ProtectedRoute>
              <SinglePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};
