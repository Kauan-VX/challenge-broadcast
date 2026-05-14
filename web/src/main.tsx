import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const brand = '#FFDE06';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brand,
      contrastText: '#0A0A0A',
    },
    secondary: {
      main: '#F5F5F5',
      contrastText: '#0A0A0A',
    },
    success: { main: '#22C55E' },
    warning: { main: brand },
    error: { main: '#EF4444' },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#9CA3AF',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
        containedPrimary: {
          color: '#0A0A0A',
          fontWeight: 700,
          '&:hover': { backgroundColor: '#FFE74D' },
        },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { color: 'default' },
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#101010',
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.18)' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            color: '#9CA3AF',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            borderColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(255, 255, 255, 0.06)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141414',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 14,
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
