import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';

import Link from 'src/components/Link';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

function Hero() {
  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            SERA Dashboard
          </TypographyH1>
          <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            Enhancing Supply Chain via DeFi and Blockchain. SERA is a
            decentralized protocol that adds DeFi Power to ERP via blockchain.
            SERA blockchain-based protocol reduces the cost of audits, enhances
            data integrity, enables multiparty data sharing, and provides a
            foundation for global DeFi-enabled commerce.
          </TypographyH2>
          <Button
            component={Link}
            href="/applications/business-ecosystem"
            size="large"
            variant="contained"
          >
            Launch the app
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
