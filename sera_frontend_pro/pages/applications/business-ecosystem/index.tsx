import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/BusinessEcosystem/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import BusinessPartnersTable from '@/content/Applications/BusinessEcosystem/BusinessPartnersTable';

function ApplicationsBusinessEcosystem() {
  return (
    <>
      <Head>
        <title>BusinessEcosystem - Applications</title>
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
            <BusinessPartnersTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsBusinessEcosystem.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsBusinessEcosystem;
