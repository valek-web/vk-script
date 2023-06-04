import React from 'react'
import Alert from '@mui/material/Alert';

export const Error = (props) => {
  return (
    <Alert severity="error" style={{margin: "10px 0"}}>{props.info}</Alert>
  )
}
