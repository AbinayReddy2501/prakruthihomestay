import { useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showToast = (newMessage: string, newSeverity: AlertColor = 'info') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  const ToastComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={hideToast} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
};
