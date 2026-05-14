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
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContact, updateContact } from '../services/contacts';
import { useToast } from '../hooks/useToast';
import { formatPhone } from '../lib/phone';
import { contactSchema, type ContactInput } from '../schemas/contact';
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
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editing?.name ?? '',
        phone: editing ? formatPhone(editing.phone) : '',
      });
    }
  }, [open, editing, reset]);

  async function onSubmit(values: ContactInput) {
    try {
      if (editing) {
        await updateContact(editing.id, values.name, values.phone);
        toast.success('Contato atualizado.');
      } else {
        await createContact({
          userId,
          connectionId,
          name: values.name,
          phone: values.phone,
        });
        toast.success('Contato criado.');
      }
      onClose();
    } catch {
      toast.error('Não foi possível salvar o contato.');
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
              autoFocus
              fullWidth
              placeholder="Ex.: João Silva"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              {...register('name')}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Telefone"
                  fullWidth
                  placeholder="(11) 99999-0000"
                  inputMode="tel"
                  value={field.value}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  error={Boolean(errors.phone)}
                  helperText={
                    errors.phone?.message ?? 'Inclua o DDD. Ex.: (11) 99999-0000'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
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
