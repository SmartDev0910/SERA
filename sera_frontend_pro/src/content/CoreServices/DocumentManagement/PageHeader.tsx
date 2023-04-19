import React, { useContext } from 'react';
import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ComposeDialog from './ComposeDialog';
import { SeraContext } from '@/contexts/SeraContext';

function PageHeader() {
  const user = {
    name: 'Rory Porter',
    avatar: '/static/images/avatars/avatar.jpg'
  };
  const { handleOpenAPDialog } = useContext(SeraContext);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Document Mangement
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your recent transactions
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => handleOpenAPDialog()}
          >
            Compose
          </Button>
        </Grid>
      </Grid>
      <ComposeDialog />
    </>
  );
}

export default PageHeader;
