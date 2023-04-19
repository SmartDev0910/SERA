import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Applications/Invoices/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';
import InvoicesTable from '@/content/Applications/Invoices/InvoicesTable';

function ApplicationsInvoices() {
  return (
    <>
      <Head>
        <title>Invoices - Applications</title>
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
            <InvoicesTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsInvoices.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsInvoices;
