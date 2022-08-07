import React from "react";

const ErrorTextComponent = ({ error, visible }) => {
  if (!error || !visible) return null;
  return (
    <span
      style={{
        display: "block",
        color: "red",
        textAlign: "left",
        padding: "0px 0px",
        fontSize: "0.8rem",
      }}
    >
      {error}
    </span>
  );
};

export default ErrorTextComponent;
