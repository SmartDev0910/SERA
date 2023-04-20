import React, { useContext } from 'react';
import { Typography, Button, Grid } from '@mui/material';

import CreateIcon from '@mui/icons-material/Create';
import DeployTokenDialog from './DeployTokenDialog';
import { SeraContext } from '@/contexts/SeraContext';

function PageHeader() {
  const user = {
    name: 'Rory Porter',
    avatar: '/static/images/avatars/avatar.jpg'
  };
  const { handleOpenFlag } = useContext(SeraContext);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Tokenization
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your recent transactions
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<CreateIcon fontSize="small" />}
            onClick={() => handleOpenFlag()}
          >
            Deploy New Token
          </Button>
        </Grid>
      </Grid>
      <DeployTokenDialog />
    </>
  );
}

export default PageHeader;
