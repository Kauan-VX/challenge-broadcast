import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { Connection } from '../types';

type Props = {
  connection: Connection;
  onOpen: (id: string) => void;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
};

export function ConnectionCard({ connection, onOpen, onEdit, onDelete }: Props) {
  return (
    <Card
      sx={{
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'rgba(255, 222, 6, 0.4)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={() => onOpen(connection.id)}>
        <CardContent sx={{ pb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 222, 6, 0.1)',
                color: '#FFDE06',
              }}
            >
              <HubOutlinedIcon />
            </Box>
            <ArrowForwardRoundedIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {connection.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Abrir contatos e mensagens
          </Typography>
        </CardContent>
      </CardActionArea>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, py: 0.5 }}>
        <IconButton size="small" onClick={() => onEdit(connection)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(connection)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
