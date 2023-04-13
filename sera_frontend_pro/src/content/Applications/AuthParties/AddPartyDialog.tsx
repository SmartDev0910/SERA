import React, { ChangeEvent, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider/Divider';
import Grid from '@mui/material/Grid';
import { SeraContext } from '@/contexts/SeraContext';

const AddPartyDialog = () => {
  const { openAPDialog, authParties, handleCloseAPDialog } =
    useContext(SeraContext);
  const [wallet_address, setWalletAddress] = useState<string>('');
  console.log('----------', authParties);
  return (
    <div>
      <Dialog
        open={openAPDialog}
        onClose={handleCloseAPDialog}
        fullWidth={true}
      >
        <DialogTitle>Add Business Partner</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Wallet Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <Divider style={{ marginTop: '12px', marginBottom: '24px' }} />
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>Wallet Address:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {authParties
                  .filter((item) => item.w_address.includes(wallet_address))[0]
                  .w_address.substring(0, 5) +
                  ' ... ' +
                  authParties
                    .filter((item) =>
                      item.w_address.includes(wallet_address)
                    )[0]
                    .w_address.substring(38)}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>Trade Name:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {
                  authParties.filter((item) =>
                    item.w_address.includes(wallet_address)
                  )[0].t_name
                }
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>Country:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {
                  authParties.filter((item) =>
                    item.w_address.includes(wallet_address)
                  )[0].country
                }
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>State/town:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {
                  authParties.filter((item) =>
                    item.w_address.includes(wallet_address)
                  )[0].state_town
                }
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>Email:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {
                  authParties.filter((item) =>
                    item.w_address.includes(wallet_address)
                  )[0].email
                }
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} textAlign={'right'}>
              <div>Phone Number:</div>
            </Grid>
            <Grid item md={6}>
              <div>
                {
                  authParties.filter((item) =>
                    item.w_address.includes(wallet_address)
                  )[0].phone
                }
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAPDialog}>Close</Button>
          <Button onClick={handleCloseAPDialog}>Send Invitation</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPartyDialog;
