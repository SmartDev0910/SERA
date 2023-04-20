import React, { ChangeEvent, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { SeraContext } from '@/contexts/SeraContext';

const AddMaterialDialog = () => {
  const { openFlag, handleCloseFlag } = useContext(SeraContext);
  const [material_name, setMaterialName] = useState<string>('');

  return (
    <div>
      <Dialog open={openFlag} onClose={handleCloseFlag} fullWidth={true}>
        <DialogTitle>
          <Typography variant="h3">Add Material</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Material Name"
            fullWidth
            variant="standard"
            value={material_name}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setMaterialName(event.target.value);
            }}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            margin="dense"
            label="Publish Number"
            fullWidth
            variant="standard"
            value={material_name}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setMaterialName(event.target.value);
            }}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            disabled
            margin="dense"
            label="Wallet Address"
            fullWidth
            variant="standard"
            value={material_name}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            margin="dense"
            label="Material Name"
            fullWidth
            variant="standard"
            value={material_name}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setMaterialName(event.target.value);
            }}
            style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlag}>Close</Button>
          <Button onClick={handleCloseFlag} variant="contained">
            Add Material
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMaterialDialog;
