import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 4,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
            width: { xs: '100%', md: 'auto' },
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
