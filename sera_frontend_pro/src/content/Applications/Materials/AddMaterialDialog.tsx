import React, { ChangeEvent, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { SeraContext } from '@/contexts/SeraContext';

const AddMaterialDialog = () => {
  const { openAPDialog, handleCloseAPDialog } = useContext(SeraContext);
  const [wallet_address, setWalletAddress] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleWalletAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setWalletAddress(event.target.value);
  };

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
            value={wallet_address}
            onChange={handleWalletAddressChange}
          />
          <Divider style={{ marginTop: '12px', marginBottom: '24px' }} />
          <TextField
            error={false}
            label="Business Partner Email"
            variant="standard"
            fullWidth={true}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            error={false}
            label="Your Email"
            variant="standard"
            fullWidth={true}
            style={{ marginBottom: '10px' }}
          />
          <FormControl sx={{ width: '100%' }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAPDialog}>Close</Button>
          <Button onClick={handleCloseAPDialog} variant="contained">
            Add Material
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMaterialDialog;
