import React from "react";

import Select from "@mui/material/Select";

import "./CustomSelect.css";

export const CustomSelect = (props) => {
  return <Select {...props}>{props.children}</Select>;
};
