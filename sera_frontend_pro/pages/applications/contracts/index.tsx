import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/Contracts/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Footer from '@/components/Footer';

import HailIcon from '@mui/icons-material/Hail';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

import ProposalsTable from '@/content/Applications/Contracts/ProposalsTable';
import RFQsTable from '@/content/Applications/Contracts/RFQsTable';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ApplicationsContracts() {
  const [currentTab, setCurrentTab] = useState<string>('rfq');

  const tabs = [
    {
      value: 'rfq',
      label: 'Request For Quotation',
      icon: <HailIcon />
    },
    { value: 'proposal', label: 'Proposal', icon: <DeliveryDiningIcon /> }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Contracts - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
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
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'rfq' && <RFQsTable />}
            {currentTab === 'proposal' && <ProposalsTable />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsContracts.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsContracts;
