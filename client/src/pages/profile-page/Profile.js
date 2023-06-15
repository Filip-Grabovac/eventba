import React from "react";
import { Hero } from "./Hero";
import { ProfileForm } from "./ProfileForm";

export const Profile = () => {
  return (
    <div className="profile">
      <Hero />
      <ProfileForm />
    </div>
  );
};
