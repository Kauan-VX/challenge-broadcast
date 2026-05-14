import { useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createConnection, updateConnection } from '../services/connections';
import { useToast } from '../hooks/useToast';
import { connectionSchema, type ConnectionInput } from '../schemas/connection';
import type { Connection } from '../types';

type Props = {
  open: boolean;
  editing: Connection | null;
  userId: string;
  onClose: () => void;
};

export function ConnectionFormDialog({ open, editing, userId, onClose }: Props) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConnectionInput>({
    resolver: zodResolver(connectionSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: editing?.name ?? '' });
    }
  }, [open, editing, reset]);

  async function onSubmit(values: ConnectionInput) {
    try {
      if (editing) {
        await updateConnection(editing.id, values.name);
        toast.success('Conexão atualizada.');
      } else {
        await createConnection(userId, values.name);
        toast.success('Conexão criada.');
      }
      onClose();
    } catch {
      toast.error('Não foi possível salvar a conexão.');
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            autoFocus
            fullWidth
            placeholder="Ex.: Atendimento Principal"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
