import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CreateProposal = () => {
  const [age, setAge] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(null);
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Request For Quotation
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Request For Quotation"
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled
            id="outlined-basic"
            label="Business Partner"
            variant="outlined"
            fullWidth={true}
            defaultValue="Com 091"
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProposal;
