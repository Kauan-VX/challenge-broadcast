import { useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useAuth } from '../hooks/useAuth';
import { useConnection } from '../hooks/useConnection';
import { useContacts } from '../hooks/useContacts';
import { deleteContact } from '../services/contacts';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ConnectionTabs } from '../components/ConnectionTabs';
import { ContactFormDialog } from '../components/ContactFormDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { formatPhone } from '../lib/phone';
import type { Contact } from '../types';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function Contacts() {
  const { connectionId = '' } = useParams();
  const { user } = useAuth();
  const { connection, loading: connectionLoading, notFound } = useConnection(connectionId);
  const { contacts, loading } = useContacts(user?.uid, connectionId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [toDelete, setToDelete] = useState<Contact | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditing(contact);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!toDelete) return;
    await deleteContact(toDelete.id);
    setToDelete(null);
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
        title="Contatos"
        subtitle={
          contacts.length === 1
            ? '1 contato cadastrado.'
            : `${contacts.length} contatos cadastrados.`
        }
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Novo contato
          </Button>
        }
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={<GroupOutlinedIcon />}
          title="Nenhum contato cadastrado"
          description="Adicione contatos para depois enviar ou agendar mensagens em massa."
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Adicionar contato
            </Button>
          }
        />
      ) : (
        <Card>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 480 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Contato</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: 13,
                            fontWeight: 700,
                            bgcolor: 'rgba(255, 222, 6, 0.12)',
                            color: '#FFDE06',
                          }}
                        >
                          {initials(contact.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {contact.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatPhone(contact.phone)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEdit(contact)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setToDelete(contact)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {user && (
        <ContactFormDialog
          open={formOpen}
          editing={editing}
          userId={user.uid}
          connectionId={connectionId}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir contato"
        description={`Excluir o contato "${toDelete?.name}"?`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
