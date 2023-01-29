import React from "react";
import ReadmoreTrimer from "./ReadmoreTrimer";
import { useState } from "react";
import DOMPurify from 'dompurify';

const ReadMoreTag = ({
  text,
  min,
  ideal,
  max,
  readMoreTextOption = "Read More",
}) => {
  const PurifyLineBreaks = (text) => {
    const purifiedText = DOMPurify.sanitize(text, {ALLOWED_TAGS: ['br']});
    return purifiedText;
  };
  text = PurifyLineBreaks(text);
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
        <span className="displayed-text" dangerouslySetInnerHTML={{ __html: `${primaryText} ${secondaryText}` }}/>
         
      </div>
    );
  } else if (displaySecondary) {
    displayText = (
      <div className="display-text-group">
        <span className="displayed-text" onClick={setStatus.bind()} dangerouslySetInnerHTML={{ __html:  `${primaryText} ${secondaryText}` }}/>
       
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
          <span style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: secondaryText}}/>
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
  return displayText;
};

export default ReadMoreTag;
