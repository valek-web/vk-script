import React from "react";
import "./Popup.css"

export const Popup = (props) => {
  return (
    <div className="popup">
        {props.children}
    </div>
  );
};
