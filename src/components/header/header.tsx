import React, { ReactElement, MouseEvent, useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HiveIcon from '@mui/icons-material/Hive';
import {
  CssBaseline,
  useScrollTrigger,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
} from '@mui/material';
import { logout } from '@/firebase';
import useAuth from '@/custom-hooks/useAuth';
import './header.css';

const pages = [
  {
    page: 'About',
    link: '/about',
  },
  {
    page: 'Welcome',
    link: '/welcome',
  },
];

const reg = [
  {
    page: 'Sing in',
    link: '/auth',
  },
  {
    page: 'Sing up',
    link: '/reg',
  },
];

interface Props {
  window?: () => Window;
  children: ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export const Header = (): ReactElement => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { currentUser } = useAuth();

  const headerRef = useRef(null);

  const stickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        if (headerRef.current) {
          (headerRef.current as HTMLElement).classList.add('sticky');
        }
      } else {
        if (headerRef.current) {
          (headerRef.current as HTMLElement).classList.remove('sticky');
        }
      }
    });
  };

  useEffect(() => {
    stickyHeader();
    return () => window.addEventListener('scroll', stickyHeader);
  });

  return (
    <>
      <CssBaseline />
      <ElevationScroll>
        <AppBar ref={headerRef}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <HiveIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Link to="/" component={RouterLink} sx={{ textDecoration: 'none' }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    textDecoration: 'none',
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
                  {pages.map((page) => (
                    <MenuItem key={page.page} onClick={handleCloseNavMenu}>
                      <Link to={page.link} component={RouterLink} sx={{ textDecoration: 'none' }}>
                        <Typography textAlign="center">{page.page}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                  {!currentUser ? (
                    reg.map((page) => (
                      <MenuItem key={page.page} onClick={handleCloseNavMenu}>
                        <Link to={page.link} component={RouterLink} sx={{ textDecoration: 'none' }}>
                          <Typography textAlign="center">{page.page}</Typography>
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
                  textDecoration: 'none',
                }}
              >
                GraphQL
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page.page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    component={RouterLink}
                    to={page.link}
                  >
                    {page.page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                {currentUser ? (
                  <Box sx={{ flexGrow: 1 }}>
                    <Button
                      variant="outlined"
                      sx={{ my: 2, color: 'white', display: 'block' }}
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </Box>
                ) : // <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                //   {reg.map((page) => (
                //     <Button
                //       variant="outlined"
                //       key={page.page}
                //       sx={{ my: 2, color: 'white', display: 'block' }}
                //       component={RouterLink}
                //       to={page.link}
                //     >
                //       {page.page}
                //     </Button>
                //   ))}
                // </Box>
                null}

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
      </ElevationScroll>
      <Toolbar />
    </>
  );
};
