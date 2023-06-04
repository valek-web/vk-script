import React from "react";
import Button from "@mui/material/Button";

export const MyButton = (props) => {
  return (
    <Button
      sx={{
        backgroundColor: "#e5ac21",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#ad8318",
          boxShadow: "none",
        },
      }}
      variant="contained"
      style={{ width: "100%" }}
      {...props}
    >
      {props.children}
    </Button>
  );
};
