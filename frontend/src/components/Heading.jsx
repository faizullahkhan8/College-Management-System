import React from "react";
const heading = (props) => {
  return (
    <p className="font-semibold text-3xl border-l-8 border-red-500 pl-3">
      {props.title}
    </p>
  );
};

export default heading;
