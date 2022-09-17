import React from "react";
import ReadmoreTrimer from "./ReadmoreTrimer";
import { useState } from "react";

const ReadMoreTag = ({
  text,
  min,
  ideal,
  max,
  readMoreTextOption = "Read More",
}) => {
  console.log("🚀 ~ file: ReadMoreTag.js ~ line 12 ~ text", text);
  let args = [text, min, ideal, max];

  const [primaryText, secondaryText] = ReadmoreTrimer(...args);

  //states
  const [displaySecondary, setDisplaySecondary] = useState(false);
  const [readMoreText, setReadMoreText] = useState(readMoreTextOption);

  const setStatus = () => {
    let display = !displaySecondary;
    setDisplaySecondary(display);
  };

  let displayText;
  if (!secondaryText) {
    displayText = (
      <div className="display-text-group">
        <span className="displayed-text">
          {`${primaryText} ${secondaryText}`}
        </span>
      </div>
    );
  } else if (displaySecondary) {
    displayText = (
      <div className="display-text-group">
        <span className="displayed-text" onClick={setStatus.bind()}>
          {`${primaryText} ${secondaryText}`}
        </span>
        <div
          className="read-more-button show-more-option-jquery"
          onClick={setStatus.bind()}
        >
          Show less
        </div>
      </div>
    );
  } else {
    displayText = (
      <div className="display-text-group">
        <span className="displayed-text">
          {primaryText}
          <span style={{ display: "none" }}>{secondaryText}</span>
          <div
            className="read-more-button show-more-option-jquery"
            onClick={setStatus.bind()}
          >
            {readMoreText}
          </div>
        </span>
      </div>
    );
  }
  console.log("🚀 ~ file: ReadMoreTag.js ~ line 37 ~ displayText", displayText);
  return displayText;
};

export default ReadMoreTag;
