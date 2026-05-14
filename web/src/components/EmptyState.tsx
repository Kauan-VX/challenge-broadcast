import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 222, 6, 0.08)',
            color: '#FFDE06',
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360 }}>
          {description}
        </Typography>
        {action}
      </Box>
    </Card>
  );
}
