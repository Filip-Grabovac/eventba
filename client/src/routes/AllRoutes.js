import React from "react";
import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/landing/Landing";
import SinglePage from "../pages/single-page/SinglePage";
import { Profile } from "../pages/profile-page/Profile";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="/single" element={<SinglePage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};
