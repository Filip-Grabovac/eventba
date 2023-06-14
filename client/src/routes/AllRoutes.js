import React from "react";
import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/landing/Landing";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Landing />} />
      </Routes>
    </div>
  );
};
