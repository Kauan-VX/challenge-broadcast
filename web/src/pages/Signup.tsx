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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { AuthShell } from '../components/AuthShell';
import { PasswordField } from '../components/PasswordField';
import { signupSchema, type SignupInput } from '../schemas/signup';

export function Signup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
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

  async function onSubmit(values: SignupInput) {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, values.email.trim(), values.password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setError('E-mail já cadastrado.');
      } else if (err instanceof FirebaseError && err.code === 'auth/weak-password') {
        setError('Senha muito fraca. Use pelo menos 6 caracteres.');
      } else {
        setError('Não foi possível concluir o cadastro.');
      }
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a usar o Broadcast agora."
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
            helperText={errors.password?.message ?? 'Mínimo de 6 caracteres.'}
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
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Cadastrar'}
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
