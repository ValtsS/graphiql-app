import { logout } from '@/core/firebase';
import useAuth from '@/custom-hooks/useAuth';
import { RouteConfig } from '@/routes/routes-config';
import { SwitchMode } from './langSwitch';
import { useTranslation } from 'react-i18next';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './header.css';

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

  const { currentUser } = useAuth();

  useLayoutEffect(() => {
    function update() {
      setSticky(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0);
    }
    window.addEventListener('scroll', update);
    update();
    return () => window.removeEventListener('scroll', update);
  });

  const headerMenu = routesConfig.filter((el) => !el.displayInRegistration);
  const signMenu = routesConfig.filter((el) => el.displayInRegistration);

  const handleLogout = () => {
    logout();
    navigate('/');
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
                aria-label="account of current user"
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
                    <Link to="/" component={RouterLink} sx={{ textDecoration: 'none' }}>
                      <Typography textAlign="center">Sign Out</Typography>
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
                        alt="Remy Sharp"
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
