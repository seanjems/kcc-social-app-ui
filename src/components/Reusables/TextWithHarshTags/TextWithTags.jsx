import React from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

const TextWithTags = (props) => {
  const navigate = useNavigate();
  const PurifyLineBreaks = (text) => {
    const purifiedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: ["br"] });
    return purifiedText;
  };

  const purifiedText = PurifyLineBreaks(props.text);

  const searchByTag = (tag) => {
    if (tag[0] === "#" && tag.length > 1) {
      tag = tag.substr(1);
    } else {
      return;
    }
    navigate(`../trending/${tag}`);
    // console.log(`Searching by tag: ${tag}`);
  };

  const textWithTags = purifiedText.split(" ").map((word, idx) => {
    if (word[0] === "#") {
      return (
        <span
          key={idx}
          style={{ color: "blue" }}
          onClick={() => searchByTag(word)}
          dangerouslySetInnerHTML={{ __html: `${word} ` }}
        />
      );
    }
    return <span key={idx} dangerouslySetInnerHTML={{ __html: `${word} ` }} />;
  });

  return <div>{textWithTags}</div>;
};

export default TextWithTags;
