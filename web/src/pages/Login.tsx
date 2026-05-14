import { useState } from 'react';
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { AuthShell } from '../components/AuthShell';
import { PasswordField } from '../components/PasswordField';
import { loginSchema, type LoginInput } from '../schemas/login';

export function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

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

  async function onSubmit(values: LoginInput) {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email.trim(), values.password);
      navigate('/', { replace: true });
    } catch {
      setError('E-mail ou senha incorretos.');
    }
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre com sua conta para continuar."
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="E-mail"
            type="email"
            autoFocus
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="seu@email.com"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            label="Senha"
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="••••••••"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password')}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.4, fontSize: 15 }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            Não tem conta?{' '}
            <Link component={RouterLink} to="/signup" sx={{ color: '#FFDE06', fontWeight: 600 }}>
              Cadastre-se
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
