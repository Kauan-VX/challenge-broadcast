import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Controller, useFormContext } from 'react-hook-form';
import { MESSAGE_CONTENT_MAX, type MessageInput } from '../schemas/message';

type Props = {
  onCancel: () => void;
};

export function MessageComposer({ onCancel }: Props) {
  const {
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<MessageInput>();

  const content = watch('content');
  const schedule = watch('schedule');

  return (
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

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                placeholder="Olá! Tudo bem? Queremos te avisar que..."
                multiline
                minRows={6}
                fullWidth
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value.slice(0, MESSAGE_CONTENT_MAX))
                }
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={Boolean(errors.content)}
                helperText={
                  errors.content?.message ??
                  `${content.length} / ${MESSAGE_CONTENT_MAX}`
                }
              />
            )}
          />

          <Box>
            <Controller
              name="schedule"
              control={control}
              render={({ field }) => (
                <Box
                  component="label"
                  htmlFor="schedule-switch"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: field.value
                      ? 'rgba(255,222,6,0.06)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(255,222,6,0.4)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,222,6,0.12)',
                      color: '#FFDE06',
                    }}
                  >
                    <ScheduleRoundedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Agendar envio
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Defina uma data e hora futura para o disparo.
                    </Typography>
                  </Box>
                  <Switch
                    id="schedule-switch"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </Box>
              )}
            />

            {schedule && (
              <Controller
                name="scheduledFor"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Data e hora"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    error={Boolean(errors.scheduledFor)}
                    helperText={errors.scheduledFor?.message}
                  />
                )}
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              bgcolor: 'rgba(255,222,6,0.06)',
              borderLeft: '3px solid #FFDE06',
            }}
          >
            {schedule ? (
              <ScheduleRoundedIcon fontSize="small" sx={{ color: '#FFDE06' }} />
            ) : (
              <SendRoundedIcon fontSize="small" sx={{ color: '#FFDE06' }} />
            )}
            <Typography variant="body2" color="text.secondary">
              {schedule
                ? 'A mensagem será marcada como enviada no horário definido.'
                : 'A mensagem será marcada como enviada imediatamente.'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button onClick={onCancel} color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                schedule ? <ScheduleRoundedIcon /> : <SendRoundedIcon />
              }
            >
              {isSubmitting ? (
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
  );
}
