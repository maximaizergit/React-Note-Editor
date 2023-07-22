import React from "react";

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
  return (
    <span style={{ backgroundColor: "lightblue", marginRight: "4px" }}>
      #{text}
    </span>
  );
};

export default Tag;
