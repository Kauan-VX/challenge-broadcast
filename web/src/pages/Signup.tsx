import { useState, type FormEvent } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { AuthShell } from '../components/AuthShell';

export function Signup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setError('E-mail já cadastrado.');
      } else if (err instanceof FirebaseError && err.code === 'auth/weak-password') {
        setError('Senha muito fraca. Use pelo menos 6 caracteres.');
      } else {
        setError('Não foi possível concluir o cadastro.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a usar o Broadcast agora."
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="seu@email.com"
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            helperText="Mínimo de 6 caracteres."
            InputLabelProps={{ shrink: true }}
            placeholder="••••••••"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{ py: 1.4, fontSize: 15 }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Cadastrar'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            Já tem conta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#FFDE06', fontWeight: 600 }}>
              Entrar
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
