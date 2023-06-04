import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';
import logo from './../img/vk-panel-logo.svg';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const Layout = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" data-bg="true" sx={{ p: 2 }}>
        <img src={logo} alt="Logo" width="200px" />
      </Typography>
      <Divider />
      <NavLink to="/delete_user" className="link link-mt">Удалить пользователей</NavLink>
      <NavLink to="/downlaod_user" className="link">Скачать пользователей группы</NavLink>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      <header>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CssBaseline />
          <AppBar component="nav" sx={{ backgroundColor: '#272727' }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              data-r="true"
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </Box>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </>
  );
};
