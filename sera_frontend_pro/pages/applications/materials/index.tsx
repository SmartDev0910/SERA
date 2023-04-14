import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/Materials/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import MaterialssTable from '@/content/Applications/Materials/MaterialsTable';

function Materials() {
  return (
    <>
      <Head>
        <title>Materials - Applications</title>
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
            <MaterialssTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Materials.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Materials;
