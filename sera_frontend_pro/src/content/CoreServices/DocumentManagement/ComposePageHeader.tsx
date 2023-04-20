import React, { useContext } from 'react';
import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { SeraContext } from '@/contexts/SeraContext';

function ComposePageHeader() {
  const user = {
    name: 'Rory Porter',
    avatar: '/static/images/avatars/avatar.jpg'
  };
  const { handleCloseFlag } = useContext(SeraContext);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Compose Document
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, please operate step by step.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => handleCloseFlag()}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ComposePageHeader;
