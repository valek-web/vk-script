import React from "react";

import TextField from "@mui/material/TextField";

export const Input = (props) => {
  const { classes } = props;
  return (
    <TextField
      classes={classes}
      label={props.label}
      variant="outlined"
      style={{
        width: "100%",
        margin: "10px 0",
      }}
      size="small"
      id={props.inputtype}
      error={props.inputtype === "outlined-error"}
      {...props}
    />
  );
};
