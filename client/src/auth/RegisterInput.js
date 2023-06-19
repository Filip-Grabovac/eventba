import React, { useEffect, useState } from "react";

export const RegisterInput = (props) => {
  const [content, setContent] = useState("");

  const handleTogglePasswordVisibility = () => {
    props.setIsPasswordVisible(!props.isPasswordVisible);
  };

  const inputType = props.isPasswordVisible ? "text" : props.type;

  return (
    <div className="register-input-wrapper">
      <input
        onChange={(e) => {
          setContent(e.target.value);
        }}
        type={inputType}
        name={props.name}
        required={props.isRequired}
        minLength={props.inputLength}
      />
      {
        <span className={`${content !== "" ? "active-input" : ""}`}>
          {props.placeholder}
        </span>
      }

      {props.icon ? (
        <img
          src={props.icon}
          alt="User Card"
          onClick={handleTogglePasswordVisibility}
          className="password-eye-icon"
        />
      ) : (
        ""
      )}
    </div>
  );
};
