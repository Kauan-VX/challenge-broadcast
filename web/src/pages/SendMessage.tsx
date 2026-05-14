import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useConnection } from '../hooks/useConnection';
import { useContacts } from '../hooks/useContacts';
import { db } from '../lib/firebase';
import {
  createMessage,
  updateScheduledMessage,
} from '../services/messages';
import { formatPhone } from '../lib/phone';
import type { Message } from '../types';

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

const CONTENT_MAX = 1000;

export function SendMessage() {
  const { connectionId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const { user } = useAuth();
  const { connection, loading: connectionLoading, notFound } = useConnection(connectionId);
  const { contacts, loading: contactsLoading } = useContacts(user?.uid, connectionId);

  const [content, setContent] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [schedule, setSchedule] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [editing, setEditing] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!editId) {
      setEditing(null);
      setContent('');
      setSelected([]);
      setSchedule(false);
      setScheduledFor('');
      setError(null);
      setSearch('');
      setLoadingEdit(false);
      return;
    }

    let active = true;
    setLoadingEdit(true);

    (async () => {
      const snap = await getDoc(doc(db, 'messages', editId));
      if (!active) return;
      if (!snap.exists()) {
        setLoadingEdit(false);
        return;
      }

      const data = snap.data() as Omit<Message, 'id'>;
      setEditing({ id: snap.id, ...data });
      setContent(data.content);
      setSelected(data.contactIds);
      if (data.scheduledFor) {
        setSchedule(true);
        setScheduledFor(toLocalInputValue(data.scheduledFor.toDate()));
      }
      setLoadingEdit(false);
    })();

    return () => {
      active = false;
    };
  }, [editId]);

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
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredContacts.map((c) => c.id));
      setSelected((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      setSelected((prev) => {
        const merged = new Set(prev);
        filteredContacts.forEach((c) => merged.add(c.id));
        return Array.from(merged);
      });
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!user) return;
    if (selected.length === 0) {
      setError('Selecione ao menos um contato.');
      return;
    }
    if (!content.trim()) {
      setError('Escreva a mensagem.');
      return;
    }

    let scheduledDate: Date | null = null;
    if (schedule) {
      if (!scheduledFor) {
        setError('Informe a data e hora do agendamento.');
        return;
      }
      const date = new Date(scheduledFor);
      if (date.getTime() <= Date.now()) {
        setError('O agendamento precisa ser no futuro.');
        return;
      }
      scheduledDate = date;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await updateScheduledMessage(editing.id, {
          content,
          scheduledFor: scheduledDate,
        });
      } else {
        await createMessage({
          userId: user.uid,
          connectionId,
          contactIds: selected,
          content,
          scheduledFor: scheduledDate,
        });
      }
      navigate(`/connections/${connectionId}/messages`);
    } finally {
      setSubmitting(false);
    }
  }

  if (notFound && !connectionLoading) {
    return <Navigate to="/" replace />;
  }

  if (loadingEdit || contactsLoading || connectionLoading || !connection) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Conexões
        </Link>
        <Link
          component={RouterLink}
          to={`/connections/${connectionId}/messages`}
          underline="hover"
          color="inherit"
        >
          {connection.name}
        </Link>
        <Typography color="text.primary">
          {editing ? 'Editar mensagem' : 'Nova mensagem'}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ mb: 4 }}>
        {editing ? 'Editar mensagem agendada' : 'Enviar mensagem'}
      </Typography>

      {contacts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 222, 6, 0.08)',
                color: '#FFDE06',
                mb: 2,
              }}
            >
              <GroupOutlinedIcon />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Sem contatos para selecionar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione contatos a esta conexão antes de criar uma mensagem.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/connections/${connectionId}/contacts`)}
            >
              Adicionar contatos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          }}
        >
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
                  disabled={Boolean(editing) || filteredContacts.length === 0}
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
                              disabled={Boolean(editing)}
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

              {editing && (
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

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Conteúdo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Escreva a mensagem que será enviada aos contatos selecionados.
                  </Typography>
                </Box>

                <TextField
                  placeholder="Olá! Tudo bem? Queremos te avisar que..."
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
                  multiline
                  minRows={6}
                  fullWidth
                  helperText={`${content.length} / ${CONTENT_MAX}`}
                />

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={schedule}
                        onChange={(e) => setSchedule(e.target.checked)}
                      />
                    }
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ScheduleRoundedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Agendar envio
                        </Typography>
                      </Stack>
                    }
                  />

                  {schedule && (
                    <TextField
                      label="Data e hora"
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  )}
                </Box>

                <Chip
                  icon={
                    schedule ? (
                      <ScheduleRoundedIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <SendRoundedIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  label={
                    schedule
                      ? 'A mensagem será marcada como enviada no horário definido'
                      : 'A mensagem será marcada como enviada imediatamente'
                  }
                  variant="outlined"
                  sx={{ height: 'auto', py: 1, justifyContent: 'flex-start' }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                  <Button
                    onClick={() => navigate(`/connections/${connectionId}/messages`)}
                    color="inherit"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    startIcon={
                      schedule ? <ScheduleRoundedIcon /> : <SendRoundedIcon />
                    }
                  >
                    {submitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : schedule ? (
                      'Agendar'
                    ) : (
                      'Enviar'
                    )}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
