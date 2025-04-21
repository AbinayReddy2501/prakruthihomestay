import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/images/brand/logo.svg"
              alt="Prakruthi Homestay"
              sx={{
                height: { xs: 40, sm: 50 },
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </RouterLink>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={RouterLink} to="/rooms" onClick={handleClose}>
                  Rooms
                </MenuItem>
                {isAuthenticated ? (
                  <>
                    <MenuItem component={RouterLink} to="/bookings" onClick={handleClose}>
                      My Bookings
                    </MenuItem>
                    {user?.role === 'ADMIN' && (
                      <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    {user?.role === 'MANAGER' && (
                      <MenuItem component={RouterLink} to="/manager" onClick={handleClose}>
                        Manager Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem component={RouterLink} to="/login" onClick={handleClose}>
                      Login
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/register" onClick={handleClose}>
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/rooms"
                color="inherit"
                sx={{ fontWeight: 500 }}
              >
                Rooms
              </Button>
              {isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/bookings"
                    color="inherit"
                    sx={{ fontWeight: 500 }}
                  >
                    My Bookings
                  </Button>
                  {user?.role === 'ADMIN' && (
                    <Button
                      component={RouterLink}
                      to="/admin"
                      color="inherit"
                      sx={{ fontWeight: 500 }}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  {user?.role === 'MANAGER' && (
                    <Button
                      component={RouterLink}
                      to="/manager"
                      color="inherit"
                      sx={{ fontWeight: 500 }}
                    >
                      Manager Dashboard
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ fontWeight: 500 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ fontWeight: 500 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
