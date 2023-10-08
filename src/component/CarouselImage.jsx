import React from 'react';
import { Paper, Typography } from '@mui/material';

const CarouselImage = ({ src, alt, caption }) => {
  return (
    <Paper elevation={3} style={{ padding: '10px', textAlign: 'center' }}>
      <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '200px' }} />
      <Typography variant="caption">{caption}</Typography>
    </Paper>
  );
};

export default CarouselImage;
