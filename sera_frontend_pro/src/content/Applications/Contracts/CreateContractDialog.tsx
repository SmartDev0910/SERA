import React, { ChangeEvent, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import CreateRFQ from './CreateRFQ';
import CreateProposal from './CreateProposal';
import { styled } from '@mui/material/styles';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import { SeraContext } from '@/contexts/SeraContext';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

const CreateContractDialog = () => {
  const { openAPDialog, handleCloseAPDialog } = useContext(SeraContext);
  const [currentTab, setCurrentTab] = useState<string>('rfq');

  const tabs = [
    { value: 'rfq', label: 'Request For Quotation' },
    { value: 'proposal', label: 'Proposal' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <div>
      <Dialog
        open={openAPDialog}
        onClose={handleCloseAPDialog}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>
          <Typography variant="h3">
            Create {currentTab === 'rfq' && 'RFQ'}
            {currentTab === 'proposal' && 'Proposal'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <TabsWrapper
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </TabsWrapper>
              </Grid>
              <Grid item xs={12}>
                {currentTab === 'rfq' && <CreateRFQ />}
                {currentTab === 'proposal' && <CreateProposal />}
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions style={{ padding: '20px' }}>
          <Button onClick={handleCloseAPDialog}>Cancel</Button>
          <Button onClick={handleCloseAPDialog} variant="contained">
            Submit {currentTab === 'rfq' && 'RFQ'}
            {currentTab === 'proposal' && 'Proposal'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateContractDialog;
