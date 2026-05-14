import { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { doc, getDoc } from 'firebase/firestore';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { useConnection } from '../hooks/useConnection';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../hooks/useToast';
import { db } from '../lib/firebase';
import { createMessage, updateScheduledMessage } from '../services/messages';
import { messageSchema, type MessageInput } from '../schemas/message';
import { MessageComposer } from '../components/MessageComposer';
import { RecipientsPanel } from '../components/RecipientsPanel';
import type { Message } from '../types';

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyForm: MessageInput = {
  content: '',
  contactIds: [],
  schedule: false,
  scheduledFor: '',
};

export function SendMessage() {
  const { connectionId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const { user } = useAuth();
  const { connection, loading: connectionLoading, notFound } = useConnection(connectionId);
  const { contacts, loading: contactsLoading } = useContacts(user?.uid, connectionId);
  const toast = useToast();

  const [editing, setEditing] = useState<Message | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));

  const methods = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (!editId) {
      setEditing(null);
      methods.reset(emptyForm);
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
      methods.reset({
        content: data.content,
        contactIds: data.contactIds,
        schedule: Boolean(data.scheduledFor),
        scheduledFor: data.scheduledFor
          ? toLocalInputValue(data.scheduledFor.toDate())
          : '',
      });
      setLoadingEdit(false);
    })();

    return () => {
      active = false;
    };
  }, [editId, methods]);

  async function onSubmit(values: MessageInput) {
    if (!user) return;

    const scheduledDate = values.schedule
      ? new Date(values.scheduledFor)
      : null;

    try {
      if (editing) {
        await updateScheduledMessage(editing.id, {
          content: values.content,
          scheduledFor: scheduledDate,
        });
        toast.success('Mensagem atualizada.');
      } else {
        await createMessage({
          userId: user.uid,
          connectionId,
          contactIds: values.contactIds,
          content: values.content,
          scheduledFor: scheduledDate,
        });
        toast.success(scheduledDate ? 'Mensagem agendada.' : 'Mensagem enviada.');
      }
      navigate(`/connections/${connectionId}/messages`);
    } catch {
      toast.error('Não foi possível salvar a mensagem.');
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
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            }}
          >
            <RecipientsPanel contacts={contacts} readOnly={Boolean(editing)} />
            <MessageComposer
              onCancel={() => navigate(`/connections/${connectionId}/messages`)}
            />
          </Box>
        </FormProvider>
      )}
    </Box>
  );
}
