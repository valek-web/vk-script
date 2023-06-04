import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

import "./Preloader.css";

export const Preloader = (props) => {
  return (
    <div className="preloader">
      <div>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress data-pr="true" />
        </Box>
        <div style={{margin: "10px 0 0"}}>{props.children}</div>
      </div>
    </div>
  );
};
