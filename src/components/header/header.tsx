import useAuth from '@/custom-hooks/useAuth';
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

  const { auth } = useAppContext();
  const { currentUser } = useAuth();

  useLayoutEffect(() => {
    function update() {
      setSticky(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0);
    }
    window.addEventListener('scroll', update);
    update();
    return () => window.removeEventListener('scroll', update);
  });

  const { pathname } = useLocation();

  const routes = filterByMode(routesConfig, [
    AccessMode.Always,
    currentUser ? AccessMode.LoggedIn : AccessMode.Guest,
  ]).filter((e) => e.path !== pathname && e.displayInMenu);

  const headerMenu = routes.filter((el) => !el.displayInRegistration);
  const signMenu = routes.filter((el) => el.displayInRegistration);

  const handleLogout = async () => {
    if (auth) {
      const error = await auth.logout();
      if (error) toast.error(error);
      else {
        toast.success('Logged out');
        navigate('/');
      }
    }
  };

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
                {headerMenu.map((page) => (
                  <MenuItem key={page.uuid} onClick={handleCloseNavMenu}>
                    <Link to={page.path} component={RouterLink}>
                      <Typography textAlign="center">{page.menuText}</Typography>
                    </Link>
                  </MenuItem>
                ))}
                {!currentUser ? (
                  signMenu.map((page) => (
                    <MenuItem key={page.uuid} onClick={handleCloseNavMenu}>
                      <Link to={page.path} component={RouterLink} sx={{ textDecoration: 'none' }}>
                        <Typography textAlign="center">{page.menuText}</Typography>
                      </Link>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link
                      to="#"
                      component={RouterLink}
                      sx={{ textDecoration: 'none' }}
                      onClick={handleLogout}
                    >
                      <Typography textAlign="center">{t('SignOut')}</Typography>
                    </Link>
                  </MenuItem>
                )}
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

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {headerMenu.map((page) => (
                <Button
                  key={page.uuid}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component={RouterLink}
                  to={page.path}
                >
                  {page.menuText}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 5 }}>
              <SwitchMode />

              {currentUser ? (
                <Box sx={{ flexGrow: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ my: 2, color: 'white', display: 'block', border: '1px solid #fff' }}
                    onClick={handleLogout}
                  >
                    {t('SignOut')}
                  </Button>
                </Box>
              ) : null}

              {currentUser ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={currentUser?.displayName}>
                    <IconButton sx={{ p: 0 }}>
                      <Avatar
                        alt={currentUser.displayName ?? ''}
                        src={currentUser ? (currentUser.photoURL as string) : ''}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};
