import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useAuth } from '../hooks/useAuth';
import { useConnections } from '../hooks/useConnections';
import {
  createConnection,
  deleteConnection,
  updateConnection,
} from '../services/connections';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { Connection } from '../types';

export function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { connections, loading } = useConnections(user?.uid);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Connection | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Connection | null>(null);

  function openCreate() {
    setEditing(null);
    setName('');
    setFormOpen(true);
  }

  function openEdit(connection: Connection) {
    setEditing(connection);
    setName(connection.name);
    setFormOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateConnection(editing.id, name);
      } else {
        await createConnection(user.uid, name);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !toDelete) return;
    await deleteConnection(user.uid, toDelete.id);
    setToDelete(null);
  }

  return (
    <Box>
      <PageHeader
        title="Conexões"
        subtitle="Cada conexão tem seus próprios contatos e mensagens."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Nova conexão
          </Button>
        }
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : connections.length === 0 ? (
        <EmptyState
          icon={<HubOutlinedIcon />}
          title="Nenhuma conexão ainda"
          description="Crie sua primeira conexão para começar a organizar seus contatos e mensagens."
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Criar conexão
            </Button>
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          {connections.map((connection) => (
            <Card
              key={connection.id}
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'rgba(255, 222, 6, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/connections/${connection.id}/contacts`)}
              >
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
                <IconButton size="small" onClick={() => openEdit(connection)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setToDelete(connection)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
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
            <Button onClick={() => setFormOpen(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !name.trim()}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir conexão"
        description={`Tem certeza que deseja excluir "${toDelete?.name}"? Todos os contatos e mensagens dessa conexão também serão removidos.`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
