import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/Contracts/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import ProposalsTable from '@/content/Applications/Contracts/ProposalsTable';

function Contracts() {
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
            <ProposalsTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Contracts.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Contracts;
