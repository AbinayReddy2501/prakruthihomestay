import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';

interface Room {
  id: string;
  name: string;
}

interface Availability {
  date: string;
  isAvailable: boolean;
  reason?: string;
}

const AvailabilityManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availabilityData, setAvailabilityData] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({
    isAvailable: true,
    reason: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom && startDate && endDate) {
      fetchAvailability();
    }
  }, [selectedRoom, startDate, endDate]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedRoom || !startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/admin/availability', {
        params: {
          roomId: selectedRoom,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      });
      setAvailabilityData(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateAvailability = async () => {
    if (!selectedRoom || !startDate || !endDate) return;

    try {
      await axios.post('/api/admin/availability/bulk-update', {
        roomId: selectedRoom,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        isAvailable: dialogData.isAvailable,
        reason: dialogData.reason,
      });
      fetchAvailability();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Availability Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Room</InputLabel>
            <Select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          disabled={!selectedRoom || !startDate || !endDate}
        >
          Update Availability
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {availabilityData.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    {format(new Date(data.date), 'MMMM d, yyyy')}
                  </Typography>
                  <Typography
                    variant="h6"
                    color={data.isAvailable ? 'success.main' : 'error.main'}
                  >
                    {data.isAvailable ? 'Available' : 'Not Available'}
                  </Typography>
                  {data.reason && (
                    <Typography variant="body2" color="text.secondary">
                      Reason: {data.reason}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Availability</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Availability Status</InputLabel>
                <Select
                  value={dialogData.isAvailable}
                  onChange={(e) =>
                    setDialogData((prev) => ({
                      ...prev,
                      isAvailable: e.target.value === 'true',
                    }))
                  }
                >
                  <MenuItem value="true">Available</MenuItem>
                  <MenuItem value="false">Not Available</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!dialogData.isAvailable && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Reason</InputLabel>
                  <Select
                    value={dialogData.reason}
                    onChange={(e) =>
                      setDialogData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                    <MenuItem value="ADMIN_RESTRICTED">Admin Restricted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateAvailability} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AvailabilityManagement;
