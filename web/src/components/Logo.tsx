import { Box, Typography } from '@mui/material';

type Props = {
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { dot: 10, text: 18, gap: 8 },
  md: { dot: 12, text: 22, gap: 10 },
  lg: { dot: 16, text: 32, gap: 12 },
};

export function Logo({ size = 'md' }: Props) {
  const s = sizes[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${s.gap}px` }}>
      <Box
        sx={{
          width: s.dot,
          height: s.dot,
          borderRadius: '50%',
          backgroundColor: '#FFDE06',
          boxShadow: '0 0 12px rgba(255, 222, 6, 0.6)',
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: s.text,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#F5F5F5',
        }}
      >
        Broadcast
      </Typography>
    </Box>
  );
}
