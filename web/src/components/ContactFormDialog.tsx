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
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import { createContact, updateContact } from '../services/contacts';
import { formatPhone, isValidPhone } from '../lib/phone';
import type { Contact } from '../types';

type Props = {
  open: boolean;
  editing: Contact | null;
  userId: string;
  connectionId: string;
  onClose: () => void;
};

export function ContactFormDialog({
  open,
  editing,
  userId,
  connectionId,
  onClose,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setPhone(editing ? formatPhone(editing.phone) : '');
    }
  }, [open, editing]);

  const phoneValid = isValidPhone(phone);
  const canSubmit = name.trim().length > 0 && phoneValid;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      if (editing) {
        await updateContact(editing.id, name, phone);
      } else {
        await createContact({
          userId,
          connectionId,
          name,
          phone,
        });
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
            {editing ? 'Editar contato' : 'Novo contato'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editing
              ? 'Atualize as informações do contato.'
              : 'Preencha o nome e o telefone para cadastrar.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              fullWidth
              placeholder="Ex.: João Silva"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
              fullWidth
              placeholder="(11) 99999-0000"
              inputMode="tel"
              error={phone.length > 0 && !phoneValid}
              helperText={
                phone.length > 0 && !phoneValid
                  ? 'Informe um telefone válido com DDD.'
                  : 'Inclua o DDD. Ex.: (11) 99999-0000'
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving || !canSubmit}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
