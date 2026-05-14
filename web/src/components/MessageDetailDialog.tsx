import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { format } from 'date-fns';
import { formatPhone } from '../lib/phone';
import type { Contact, Message } from '../types';

type Props = {
  open: boolean;
  message: Message | null;
  contactsById: Map<string, Contact>;
  onClose: () => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function formatDate(value: Message['scheduledFor']): string {
  if (!value) return '—';
  return format(value.toDate(), "dd/MM/yyyy 'às' HH:mm");
}

export function MessageDetailDialog({ open, message, contactsById, onClose }: Props) {
  if (!message) return null;

  const isScheduled = message.status === 'scheduled';
  const recipients = message.contactIds
    .map((id) => contactsById.get(id))
    .filter((c): c is Contact => Boolean(c));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h6">Detalhes da mensagem</Typography>
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
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              CONTEÚDO
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2">{message.content}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {message.content.length} caracteres
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                AGENDADA
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDate(message.scheduledFor)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                ENVIADA
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDate(message.sentAt)}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              DESTINATÁRIOS ({recipients.length})
            </Typography>
            <Box sx={{ mt: 1, maxHeight: 280, overflowY: 'auto', pr: 1 }}>
              <Stack divider={<Divider flexItem />}>
                {recipients.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Os destinatários originais foram removidos.
                  </Typography>
                ) : (
                  recipients.map((contact) => (
                    <Stack
                      key={contact.id}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ py: 1 }}
                    >
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
                  ))
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
