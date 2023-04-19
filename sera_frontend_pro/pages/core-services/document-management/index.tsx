import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/CoreServices/DocumentManagement/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import DocumentsTable from '@/content/CoreServices/DocumentManagement/DocumentsTable';

function CoreServicesDocumentManagement() {
  return (
    <>
      <Head>
        <title>Document Management - Core Services</title>
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
            <DocumentsTable />
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
