import { useAppContext } from '@/provider';
import HiveIcon from '@mui/icons-material/Hive';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { MouseEvent, ReactElement, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './header.css';
import { SwitchMode } from './langSwitch';
import { AccessMode, RouteConfig, filterByMode } from '@/routes/routes-config';

interface Props {
  routesConfig: RouteConfig[];
}

export const Header = (props: Props): ReactElement => {
  const { routesConfig } = props;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [isSticky, setSticky] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useLayoutEffect(() => {
    function update() {
      setSticky(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0);
    }
    window.addEventListener('scroll', update);
    update();
    return () => window.removeEventListener('scroll', update);
  });

  const { pathname } = useLocation();

  return (
    <>
      <CssBaseline />
      <AppBar className={isSticky ? 'sticky' : ''}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <HiveIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Link to="/" component={RouterLink}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#fff',
                }}
              >
                GraphQL
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label={t('account of current user') as string}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <SwitchMode />
                </MenuItem>
              </Menu>
            </Box>
            <HiveIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
              }}
            >
              GraphQL
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 5 }}>
              <SwitchMode />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};
