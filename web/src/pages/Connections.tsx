import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import { useAuth } from '../hooks/useAuth';
import { useConnections } from '../hooks/useConnections';
import { deleteConnection } from '../services/connections';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ConnectionCard } from '../components/ConnectionCard';
import { ConnectionFormDialog } from '../components/ConnectionFormDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { Connection } from '../types';

export function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { connections, loading } = useConnections(user?.uid);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Connection | null>(null);
  const [toDelete, setToDelete] = useState<Connection | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(connection: Connection) {
    setEditing(connection);
    setFormOpen(true);
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
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onOpen={(id) => navigate(`/connections/${id}/contacts`)}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          ))}
        </Box>
      )}

      {user && (
        <ConnectionFormDialog
          open={formOpen}
          editing={editing}
          userId={user.uid}
          onClose={() => setFormOpen(false)}
        />
      )}

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
