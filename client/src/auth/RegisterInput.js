import React, { useEffect, useState, useRef } from "react";

export const RegisterInput = React.forwardRef((props, ref) => {
  const [content, setContent] = useState("");

  const handleTogglePasswordVisibility = () => {
    props.setIsPasswordVisible(!props.isPasswordVisible);
  };

  const inputType = props.isPasswordVisible ? "text" : props.type;

  useEffect(() => {
    if (props.name === "repeatPassword" && props.showError) {
      ref.current.focus();
    }
  }, [props.showError, props.name, ref]);

  return (
    <div className="register-input-wrapper">
      <input
        ref={ref}
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
          onClick={props.cursorPointer ? handleTogglePasswordVisibility : null}
          className="password-eye-icon"
          style={props.cursorPointer ? { cursor: "pointer" } : {}}
        />
      ) : (
        ""
      )}
    </div>
  );
});
