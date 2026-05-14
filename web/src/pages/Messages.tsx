import { useMemo, useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useConnection } from '../hooks/useConnection';
import { useContacts } from '../hooks/useContacts';
import { useMessages } from '../hooks/useMessages';
import { useToast } from '../hooks/useToast';
import { deleteMessage } from '../services/messages';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ConnectionTabs } from '../components/ConnectionTabs';
import { EmptyState } from '../components/EmptyState';
import { MessageDetailDialog } from '../components/MessageDetailDialog';
import { PageHeader } from '../components/PageHeader';
import type { Message, MessageFilter } from '../types';

const PAGE_STEP = 50;

function formatDate(value: Message['scheduledFor']): string {
  if (!value) return '—';
  return format(value.toDate(), "dd/MM/yyyy 'às' HH:mm");
}

export function Messages() {
  const { connectionId = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connection, loading: connectionLoading, notFound } = useConnection(connectionId);
  const { contacts } = useContacts(user?.uid, connectionId);
  const [pageSize, setPageSize] = useState(PAGE_STEP);
  const { messages, loading } = useMessages(user?.uid, connectionId, pageSize);
  const toast = useToast();

  const [filter, setFilter] = useState<MessageFilter>('all');
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [viewing, setViewing] = useState<Message | null>(null);
  const hasMore = messages.length >= pageSize;

  const contactsById = useMemo(
    () => new Map(contacts.map((c) => [c.id, c])),
    [contacts],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter((m) => m.status === filter);
  }, [messages, filter]);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteMessage(toDelete.id);
      toast.success('Mensagem excluída.');
    } catch {
      toast.error('Não foi possível excluir a mensagem.');
    } finally {
      setToDelete(null);
    }
  }

  if (notFound && !connectionLoading) {
    return <Navigate to="/" replace />;
  }

  if (connectionLoading || !connection) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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
        <Typography color="text.primary">{connection.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ mb: 1 }}>
        {connection.name}
      </Typography>

      <ConnectionTabs connectionId={connectionId} />

      <PageHeader
        title="Mensagens"
        subtitle="Envie ou agende mensagens para os contatos desta conexão."
        actions={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <TextField
              select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value as MessageFilter)}
              sx={{ minWidth: { sm: 160 } }}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="scheduled">Agendadas</MenuItem>
              <MenuItem value="sent">Enviadas</MenuItem>
            </TextField>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/connections/${connectionId}/messages/send`)}
            >
              Nova mensagem
            </Button>
          </Stack>
        }
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ChatBubbleOutlineRoundedIcon />}
          title={filter === 'all' ? 'Nenhuma mensagem ainda' : 'Sem mensagens neste filtro'}
          description={
            filter === 'all'
              ? 'Crie sua primeira mensagem para esta conexão.'
              : 'Tente alternar entre Agendadas e Enviadas.'
          }
          action={
            filter === 'all' ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/connections/${connectionId}/messages/send`)}
              >
                Nova mensagem
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Mensagem</TableCell>
                  <TableCell>Destinatários</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Agendada</TableCell>
                  <TableCell>Enviada</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
            <TableBody>
              {filtered.map((message) => {
                const names = message.contactIds
                  .map((id) => contactsById.get(id)?.name)
                  .filter(Boolean) as string[];
                const preview =
                  message.content.length > 80
                    ? `${message.content.slice(0, 80)}…`
                    : message.content;

                const isScheduled = message.status === 'scheduled';

                return (
                  <TableRow
                    key={message.id}
                    hover
                    onClick={() => setViewing(message)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2">{preview}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {names.slice(0, 3).map((name, idx) => (
                          <Chip key={idx} label={name} size="small" variant="outlined" />
                        ))}
                        {names.length > 3 && (
                          <Chip
                            label={`+${names.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          isScheduled ? (
                            <ScheduleRoundedIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                          )
                        }
                        label={isScheduled ? 'Agendada' : 'Enviada'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: isScheduled
                            ? 'rgba(255, 222, 6, 0.12)'
                            : 'rgba(34, 197, 94, 0.12)',
                          color: isScheduled ? '#FFDE06' : '#22C55E',
                          border: 'none',
                          '& .MuiChip-icon': {
                            color: 'inherit',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(message.scheduledFor)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(message.sentAt)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton size="small" onClick={() => setViewing(message)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      {isScheduled && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/connections/${connectionId}/messages/send?edit=${message.id}`,
                            )
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" onClick={() => setToDelete(message)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
          </Box>
          {filter === 'all' && hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Button
                onClick={() => setPageSize((size) => size + PAGE_STEP)}
                disabled={loading}
              >
                Carregar mais
              </Button>
            </Box>
          )}
        </Card>
      )}

      <MessageDetailDialog
        open={Boolean(viewing)}
        message={viewing}
        contactsById={contactsById}
        onClose={() => setViewing(null)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir mensagem"
        description="Excluir esta mensagem? Essa ação não pode ser desfeita."
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
