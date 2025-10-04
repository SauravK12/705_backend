import * as React from 'react';
import Switch from '@mui/material/Switch';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { Box } from '@mui/material';

export default function CameraSwitch({ onCameraToggle, defaultOn = true }) {
  const [checked, setChecked] = React.useState(defaultOn);

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    
    if (onCameraToggle) {
      onCameraToggle(isChecked);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        padding: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.05)'
      }}
    >
      <NoPhotographyIcon 
        sx={{ 
          color: !checked ? '#b6a7e2ff' : '#ccc',
          transition: 'color 0.3s ease'
        }} 
      />
      <Switch
        checked={checked}
        onChange={handleChange}
        sx={{
          '& .MuiSwitch-track': {
            backgroundColor: checked ? '#8e7cc3' : '#b6a7e2ff',
          },
        }}
        slotProps={{ input: { 'aria-label': 'camera toggle' } }}
        defaultChecked color="secondary"
      />
      <CameraAltIcon 
        sx={{ 
          color: checked ? '#8e7cc3' : '#ccc',
          transition: 'color 0.3s ease'
        }} 
      />
    </Box>
  );
}