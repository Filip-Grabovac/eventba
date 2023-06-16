import React, { useEffect, useState } from "react";

export const RegisterInput = (props) => {
  const [content, setContent] = useState("");

  return (
    <div className="register-input-wrapper">
      <input
        onChange={(e) => {
          setContent(e.target.value);
        }}
        type={props.type}
      />
      {
        <span className={`${content !== "" ? "active-input" : ""}`}>
          {props.placeholder}
        </span>
      }

      {props.icon ? <img src={props.icon} alt="User Card" /> : ""}
    </div>
  );
};
