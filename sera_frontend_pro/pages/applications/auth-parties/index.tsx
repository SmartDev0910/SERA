import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/AuthParties/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import AuthPartysTable from '@/content/Applications/AuthParties/AuthPartysTable';

function ApplicationsAuthParties() {
  return (
    <>
      <Head>
        <title>Authorized Parties - Applications</title>
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
            <AuthPartysTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsAuthParties.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsAuthParties;
