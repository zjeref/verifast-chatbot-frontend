import React from 'react';
import Chip from '@mui/material/Chip';

interface ClickableBubbleProps {
    content: string,
    clickHandler: (() => void);
    backgroundColor?: string,
}
const ClickableBubble = (props: ClickableBubbleProps) => {

  return (
    <Chip 
    sx={{
      margin: '.1rem',
      // backgroundColor: '#6acffd',
      backgroundColor: props.backgroundColor ? props.backgroundColor : '#6acffd',
      color: '#151515',
    }}
    label={props.content} 
    clickable 
    onClick={props.clickHandler}/>
  );
}

export default ClickableBubble;
