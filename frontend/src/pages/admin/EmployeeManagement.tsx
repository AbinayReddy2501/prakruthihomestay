import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Switch,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { useToast } from '../../hooks/useToast';
import api from '../../utils/axios';
import { format } from 'date-fns';

interface Employee {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  enabled: boolean;
  lastLogin: string;
}

const EmployeeManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: '',
    phoneNumber: '',
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      showToast('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        username: employee.username,
        email: employee.email,
        password: '',
        fullName: employee.fullName,
        role: employee.role,
        phoneNumber: employee.phoneNumber,
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: '',
        phoneNumber: '',
      });
    }
    setOpenDialog(true);
  };

  const handleOpenPasswordDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewPassword('');
    setOpenPasswordDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedEmployee) {
        await api.put(`/api/admin/employees/${selectedEmployee.id}`, formData);
        showToast('Employee updated successfully', 'success');
      } else {
        await api.post('/api/admin/employees', formData);
        showToast('Employee created successfully', 'success');
      }
      fetchEmployees();
      handleCloseDialog();
    } catch (error) {
      showToast('Failed to save employee', 'error');
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.post(`/api/admin/employees/${selectedEmployee?.id}/reset-password`, {
        newPassword,
      });
      showToast('Password reset successfully', 'success');
      handleClosePasswordDialog();
    } catch (error) {
      showToast('Failed to reset password', 'error');
    }
  };

  const handleToggleStatus = async (employeeId: string) => {
    try {
      await api.post(`/api/admin/employees/${employeeId}/toggle-status`);
      fetchEmployees();
      showToast('Employee status updated', 'success');
    } catch (error) {
      showToast('Failed to update employee status', 'error');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/api/admin/employees/${employeeId}`);
        fetchEmployees();
        showToast('Employee deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete employee', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Employee
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.username}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.role}
                      color={employee.role === 'MANAGER' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>
                    <Switch
                      checked={employee.enabled}
                      onChange={() => handleToggleStatus(employee.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    {employee.lastLogin
                      ? format(new Date(employee.lastLogin), 'MMM d, yyyy HH:mm')
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(employee)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenPasswordDialog(employee)}
                      size="small"
                      color="primary"
                    >
                      <KeyIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteEmployee(employee.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Employee Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!!selectedEmployee}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            {!selectedEmployee && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange(e as any)}
                >
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      <ToastComponent />
    </Container>
  );
};

export default EmployeeManagement;
