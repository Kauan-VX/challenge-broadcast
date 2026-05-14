import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useFormContext } from 'react-hook-form';
import { formatPhone } from '../lib/phone';
import type { MessageInput } from '../schemas/message';
import type { Contact } from '../types';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

type Props = {
  contacts: Contact[];
  readOnly?: boolean;
};

export function RecipientsPanel({ contacts, readOnly = false }: Props) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<MessageInput>();

  const selected = watch('contactIds');
  const [search, setSearch] = useState('');

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    const digits = term.replace(/\D/g, '');
    return contacts.filter((c) => {
      if (c.name.toLowerCase().includes(term)) return true;
      if (digits.length > 0 && c.phone.replace(/\D/g, '').includes(digits)) {
        return true;
      }
      return false;
    });
  }, [contacts, search]);

  const allFilteredSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selected.includes(c.id));

  function toggleAll() {
    const current = getValues('contactIds');
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredContacts.map((c) => c.id));
      setValue(
        'contactIds',
        current.filter((id) => !filteredIds.has(id)),
        { shouldValidate: true },
      );
    } else {
      const merged = new Set(current);
      filteredContacts.forEach((c) => merged.add(c.id));
      setValue('contactIds', Array.from(merged), { shouldValidate: true });
    }
  }

  function toggleOne(id: string) {
    const current = getValues('contactIds');
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setValue('contactIds', next, { shouldValidate: true });
  }

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Destinatários
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selected.length} de {contacts.length} selecionados
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={toggleAll}
            disabled={readOnly || filteredContacts.length === 0}
            sx={{ color: '#FFDE06' }}
          >
            {allFilteredSelected ? 'Limpar' : 'Selecionar todos'}
          </Button>
        </Stack>

        <TextField
          placeholder="Buscar por nome ou telefone"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon
                fontSize="small"
                sx={{ color: 'text.secondary', mr: 1 }}
              />
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ maxHeight: 380, overflowY: 'auto', pr: 1 }}>
          {filteredContacts.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 4 }}
            >
              Nenhum contato encontrado.
            </Typography>
          ) : (
            <Stack divider={<Divider flexItem />}>
              {filteredContacts.map((contact) => {
                const isChecked = selected.includes(contact.id);
                return (
                  <FormControlLabel
                    key={contact.id}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleOne(contact.id)}
                        disabled={readOnly}
                      />
                    }
                    sx={{
                      mx: 0,
                      py: 0.5,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                    }}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            fontWeight: 700,
                            bgcolor: 'rgba(255,222,6,0.12)',
                            color: '#FFDE06',
                          }}
                        >
                          {initials(contact.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {contact.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPhone(contact.phone)}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                  />
                );
              })}
            </Stack>
          )}
        </Box>

        {errors.contactIds && (
          <FormHelperText error sx={{ mt: 1 }}>
            {errors.contactIds.message}
          </FormHelperText>
        )}

        {readOnly && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2 }}
          >
            Destinatários não podem ser alterados em mensagens agendadas.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
