import React from "react";

const ErrorTextComponent = ({ error, visible, greenMessage = false }) => {
  if (!error || !visible) return null;
  return (
    <span
      style={
        greenMessage
          ? {
              display: "flex",
              color: "green",
              textAlign: "left",
              padding: "0px 0px",
              fontSize: "0.8rem",
              alignSelf: "flex-start",
            }
          : {
              display: "flex",
              color: "red",
              textAlign: "left",
              padding: "0px 0px",
              fontSize: "0.8rem",
              alignSelf: "flex-start",
            }
      }
    >
      {error}
    </span>
  );
};

export default ErrorTextComponent;
