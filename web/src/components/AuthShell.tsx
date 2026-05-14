import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { Logo } from './Logo';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,222,6,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,222,6,0.08), transparent 50%), #0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Logo size="lg" />

        <Box sx={{ maxWidth: 480, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Gerencie suas{' '}
            <Box component="span" sx={{ color: '#FFDE06' }}>
              conexões
            </Box>
            ,{' '}
            <Box component="span" sx={{ color: '#FFDE06' }}>
              contatos
            </Box>{' '}
            e mensagens em um só lugar.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 3, lineHeight: 1.6 }}
          >
            Envie e agende mensagens com segurança. Cada cliente tem seu próprio
            espaço, isolado e em tempo real.
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Broadcast
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            right: -120,
            bottom: -120,
            width: 360,
            height: 360,
            border: '40px solid rgba(255, 222, 6, 0.12)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 4, md: 8 },
          bgcolor: '#0A0A0A',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ display: { md: 'none' }, mb: 4 }}>
            <Logo size="md" />
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
