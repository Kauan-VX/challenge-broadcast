import { useEffect, useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { createConnection, updateConnection } from '../services/connections';
import type { Connection } from '../types';

type Props = {
  open: boolean;
  editing: Connection | null;
  userId: string;
  onClose: () => void;
};

export function ConnectionFormDialog({ open, editing, userId, onClose }: Props) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
    }
  }, [open, editing]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateConnection(editing.id, name);
      } else {
        await createConnection(userId, name);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">
            {editing ? 'Editar conexão' : 'Nova conexão'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editing
              ? 'Atualize o nome da conexão.'
              : 'Dê um nome para identificar a conexão.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            fullWidth
            required
            placeholder="Ex.: Atendimento Principal"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving || !name.trim()}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
