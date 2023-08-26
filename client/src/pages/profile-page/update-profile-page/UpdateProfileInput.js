import React from "react";

export const UpdateProfileInput = ({
  placeholder,
  id,
  inputValue,
  setValue,
}) => {
  return (
    <div className="col">
      <input
        placeholder={placeholder}
        type="text"
        id={id}
        value={inputValue || ""}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
