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

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const TsAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #dfebf6;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const NextJsAvatar = styled(Box)(
  ({ theme }) => `
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  border-radius: ${theme.general.borderRadius};
  background-color: #dfebf6;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
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
          <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            SERA Dashboard
          </TypographyH1>
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
            href="/dashboards/tasks"
            size="large"
            variant="contained"
          >
            Go To the Dashboard
          </Button>
          <Grid container spacing={3} mt={5}>
            <Grid item md={4}>
              <MuiAvatar>
                <img
                  src="/static/images/logo/material-ui.svg"
                  alt="Material-UI"
                />
              </MuiAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Powered by MUI (Material-UI)</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  A simple and customizable component library to build faster,
                  beautiful, and accessible React apps.
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={4}>
              <NextJsAvatar>
                <img src="/static/images/logo/next-js.svg" alt="NextJS" />
              </NextJsAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Built with Next.js</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  Next.js gives you the best developer experience with all the
                  features you need for production.
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={4}>
              <TsAvatar>
                <img
                  src="/static/images/logo/typescript.svg"
                  alt="Typescript"
                />
              </TsAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Built with Typescript</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  Tokyo Free Black features a modern technology stack and is
                  built with React + Typescript.
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
