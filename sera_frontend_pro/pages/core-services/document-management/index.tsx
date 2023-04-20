import { ChangeEvent } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/CoreServices/DocumentManagement/PageHeader';
import ComposePageHeader from '@/content/CoreServices/DocumentManagement/ComposePageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { SeraContext } from '@/contexts/SeraContext';
import { Grid, Container, Tabs, Tab } from '@mui/material';

import DocumentsTable from '@/content/CoreServices/DocumentManagement/DocumentsTable';
import ComposeDocument from '@/content/CoreServices/DocumentManagement/ComposeDocument';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function CoreServicesDocumentManagement() {
  const { openFlag, currentTab, SetCurrentTab } = useContext(SeraContext);

  const tabs = [
    { value: 'inbox', label: 'Inbox' },
    { value: 'drafts', label: 'Drafts' },
    { value: 'sent', label: 'Sent' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    SetCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>
          {openFlag ? 'Compose' : ''} Document Management - Core Services
        </title>
      </Head>
      <PageTitleWrapper>
        {openFlag ? <ComposePageHeader /> : <PageHeader />}
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {openFlag ? (
            ''
          ) : (
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
          )}
          <Grid item xs={12}>
            {openFlag ? <ComposeDocument /> : <DocumentsTable />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

CoreServicesDocumentManagement.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default CoreServicesDocumentManagement;
