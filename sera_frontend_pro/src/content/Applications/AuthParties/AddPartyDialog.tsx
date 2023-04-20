import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider/Divider';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { SeraContext } from '@/contexts/SeraContext';

const AddPartyDialog = () => {
  const { openFlag, authParties, handleCloseFlag } = useContext(SeraContext);
  const [wallet_address, setWalletAddress] = useState<string>('');
  const detailColumns = [
    'Wallet Address:',
    'Trade Name:',
    'Country:',
    'State/town:',
    'Email:',
    'Phone Number:'
  ];
  const showDetail = () => {
    if (authParties.length) {
      return authParties.filter((item) =>
        item.w_address.includes(wallet_address)
      )[0];
    }
    return null;
  };

  const handleWalletAddressChange = (event: SelectChangeEvent) => {
    setWalletAddress(event.target.value);
  };

  useEffect(() => {
    setWalletAddress('');
  }, []);

  return (
    <div>
      <Dialog open={openFlag} onClose={handleCloseFlag} fullWidth={true}>
        <DialogTitle>
          <Typography variant="h3">Add Party</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid item md={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="wallet_address_label">Wallet Address</InputLabel>
              <Select
                labelId="wallet_address_label"
                value={wallet_address}
                onChange={handleWalletAddressChange}
                label="Wallet Address"
              >
                <MenuItem value={'0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'}>
                  0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc
                </MenuItem>
                <MenuItem value={'0x3dc4696671ca3cb6c34674a0c1729bbfcc29edd1'}>
                  0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDd1
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Divider style={{ marginTop: '12px', marginBottom: '24px' }} />
          {detailColumns.map((item, index) => {
            let data = showDetail();
            let value = '';
            switch (index) {
              case 0:
                value =
                  data?.w_address.substring(0, 5) +
                  ' ... ' +
                  data?.w_address.substring(38);
                break;
              case 1:
                value = data?.t_name;
                break;
              case 2:
                value = data?.country;
                break;
              case 3:
                value = data?.state_town;
                break;
              case 4:
                value = data?.email;
                break;
              case 5:
                value = data?.phone;
                break;
            }
            return (
              <Grid container spacing={2} key={index}>
                <Grid item md={6} textAlign={'right'}>
                  <div>{item}</div>
                </Grid>
                <Grid item md={6}>
                  <div>{value}</div>
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlag}>Close</Button>
          <Button onClick={handleCloseFlag} variant="contained">
            Add Party
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPartyDialog;
