import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/CoreServices/ShipmentManagement/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import ShipmentsTable from '@/content/CoreServices/ShipmentManagement/ShipmentsTable';

function CoreServicesShipmentManagement() {
  return (
    <>
      <Head>
        <title>Shipment Management - Core Services</title>
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
            <ShipmentsTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

CoreServicesShipmentManagement.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default CoreServicesShipmentManagement;
