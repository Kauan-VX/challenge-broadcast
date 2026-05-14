import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Snackbar } from '@mui/material';

type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

type ToastState = {
  open: boolean;
  message: string;
  severity: ToastSeverity;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const show = useCallback((message: string, severity: ToastSeverity) => {
    setState({ open: true, message, severity });
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
      info: (message) => show(message, 'info'),
    }),
    [show],
  );

  function handleClose() {
    setState((previous) => ({ ...previous, open: false }));
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={handleClose}
          sx={{ minWidth: 280 }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
