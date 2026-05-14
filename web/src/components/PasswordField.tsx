import { forwardRef, useState } from 'react';
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>(
  function PasswordField({ InputProps, ...props }, ref) {
    const [show, setShow] = useState(false);

    return (
      <TextField
        {...props}
        ref={ref}
        type={show ? 'text' : 'password'}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {show ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  },
);
