import { useContext } from 'react';
import { useRouter } from 'next/router';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArticleIcon from '@mui/icons-material/Article';
import TokenIcon from '@mui/icons-material/Token';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <>
      <MenuWrapper>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/management/profile" passHref>
                  <Button
                    className={
                      currentRoute === '/management/profile' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<AccountCircleTwoToneIcon />}
                  >
                    User Profile
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/management/profile/settings" passHref>
                  <Button
                    className={
                      currentRoute === '/management/profile/settings'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<DisplaySettingsTwoToneIcon />}
                  >
                    Account Settings
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Applications
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/business-ecosystem" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/business-ecosystem'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<InterpreterModeIcon />}
                  >
                    Business Ecosystem
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/auth-parties" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/auth-parties'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<ReduceCapacityIcon />}
                  >
                    Authorized Parties
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/materials" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/materials' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<RiceBowlIcon />}
                  >
                    Materials
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/contracts" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/contracts' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<AssignmentIndIcon />}
                  >
                    Contracts
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/purchase-orders" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/purchase-orders'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<CardTravelIcon />}
                  >
                    Purchase Orders
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/applications/invoices" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/invoices' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<ReceiptIcon />}
                  >
                    Invoices
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Core Services
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/core-services/tokenization" passHref>
                  <Button
                    className={
                      currentRoute === '/core-services/tokenization'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<TokenIcon />}
                  >
                    Tokenization
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/core-services/shipment-management" passHref>
                  <Button
                    className={
                      currentRoute === '/core-services/shipment-management'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<DirectionsBoatIcon />}
                  >
                    Shipment Management
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/core-services/document-management" passHref>
                  <Button
                    className={
                      currentRoute === '/core-services/document-management'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<ArticleIcon />}
                  >
                    Document Management
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/dashboards/tasks" passHref>
                  <Button
                    className={
                      currentRoute === '/dashboards/tasks' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<BrightnessLowTwoToneIcon />}
                  >
                    Manage Tasks
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/applications/messenger" passHref>
                  <Button
                    className={
                      currentRoute === '/applications/messenger' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<MmsTwoToneIcon />}
                  >
                    Messenger
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
