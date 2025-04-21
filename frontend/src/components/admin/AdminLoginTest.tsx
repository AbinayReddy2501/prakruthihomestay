import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import api from '../../utils/axios';

const AdminLoginTest = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminStatus, setAdminStatus] = useState<any>(null);

  const testAdminLogin = async (username: string, password: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Attempt login
      await dispatch(login({ username, password })).unwrap();
      
      // Verify admin access
      const verifyResponse = await api.get('/api/admin/test/verify');
      setSuccess(`Login successful for admin: ${verifyResponse.data.fullName}`);
      
      // Get admin status
      const statusResponse = await api.get('/api/admin/test/status');
      setAdminStatus(statusResponse.data);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Admin Login Test
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => testAdminLogin('sreekar', 'Sreekar@1108')}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Test Admin 1 (Sreekar)
          </Button>

          <Button
            variant="contained"
            onClick={() => testAdminLogin('abinay', 'Abinay@2501')}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Test Admin 2 (Abinay)
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {adminStatus && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Admin Status:
            </Typography>
            <Typography>Total Admins: {adminStatus.totalAdmins}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Admin Accounts:
            </Typography>
            {adminStatus.adminAccounts.map((admin: any) => (
              <Box key={admin.username} sx={{ ml: 2, mb: 1 }}>
                <Typography>
                  Username: {admin.username}
                </Typography>
                <Typography>
                  Full Name: {admin.fullName}
                </Typography>
                <Typography>
                  Email: {admin.email}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLoginTest;
