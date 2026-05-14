import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

export function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  async function handleLogout() {
    await signOut(auth);
    navigate('/login', { replace: true });
  }

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: 64 }}>
          <ButtonBase
            onClick={() => navigate('/')}
            sx={{ borderRadius: 1, px: 0.5 }}
          >
            <Logo />
          </ButtonBase>
          <Box sx={{ flex: 1 }} />
          <IconButton
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{ p: 0.5 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: 14,
                fontWeight: 700,
                bgcolor: '#FFDE06',
                color: '#0A0A0A',
              }}
            >
              {initial}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 220,
                  bgcolor: '#141414',
                  border: '1px solid rgba(255,255,255,0.06)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                Conectado como
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.email}
              </Typography>
            </Box>
            <MenuItem onClick={handleLogout} sx={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1 }} className="brand-grid">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
