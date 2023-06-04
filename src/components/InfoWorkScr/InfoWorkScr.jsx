import React from "react";

import "./InfoWorkScr.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const InfoWorkScr = (props) => {
  return (
    <>
      <Accordion style={{margin: "20px 0"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>{props.title}</Typography>
        </AccordionSummary>
        {props.children}
      </Accordion>
    </>
  );
};

export const InfoWorkScrItem = (props) => {
  return (
    <AccordionDetails>
      <Typography>{props.info}</Typography>
    </AccordionDetails>
  );
};
