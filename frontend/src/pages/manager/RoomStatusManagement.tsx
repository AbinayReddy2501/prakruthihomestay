import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  CleaningServices as CleaningIcon,
  Build as MaintenanceIcon,
  CheckCircle as ReadyIcon,
  Warning as IssueIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

interface RoomStatus {
  id: string;
  roomId: string;
  roomName: string;
  status: string;
  currentBookingId: string | null;
  currentGuestName: string | null;
  notes: string;
  lastCleanedAt: string;
  cleanedBy: string;
  updatedAt: string;
}

const RoomStatusManagement = () => {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomStatus | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    cleanedBy: '',
  });

  useEffect(() => {
    fetchRoomStatus();
  }, []);

  const fetchRoomStatus = async () => {
    try {
      const response = await axios.get('/api/manager/room-status');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching room status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room: RoomStatus) => {
    setSelectedRoom(room);
    setFormData({
      status: room.status,
      notes: room.notes || '',
      cleanedBy: room.cleanedBy || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRoom) return;

    try {
      await axios.put(`/api/manager/room-status/${selectedRoom.roomId}`, formData);
      fetchRoomStatus();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OCCUPIED':
        return 'error';
      case 'VACANT':
        return 'success';
      case 'CLEANING':
        return 'warning';
      case 'MAINTENANCE':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CLEANING':
        return <CleaningIcon />;
      case 'MAINTENANCE':
        return <MaintenanceIcon />;
      case 'VACANT':
        return <ReadyIcon />;
      default:
        return <IssueIcon />;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (statusFilter === 'all') return true;
    return room.status === statusFilter;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Room Status Management</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Rooms</MenuItem>
            <MenuItem value="OCCUPIED">Occupied</MenuItem>
            <MenuItem value="VACANT">Vacant</MenuItem>
            <MenuItem value="CLEANING">Cleaning</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Room {room.roomName}</Typography>
                    <Chip
                      label={room.status}
                      color={getStatusColor(room.status) as any}
                      icon={getStatusIcon(room.status)}
                    />
                  </Box>
                  
                  {room.currentGuestName && (
                    <Typography variant="body2" gutterBottom>
                      Current Guest: {room.currentGuestName}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" gutterBottom>
                    Last Cleaned: {format(new Date(room.lastCleanedAt), 'MMM d, yyyy HH:mm')}
                  </Typography>
                  
                  {room.notes && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notes: {room.notes}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleOpenDialog(room)}
                    >
                      Update Status
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Room Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <MenuItem value="VACANT">Vacant</MenuItem>
                  <MenuItem value="CLEANING">Cleaning</MenuItem>
                  <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.status === 'CLEANING' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cleaned By"
                  value={formData.cleanedBy}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cleanedBy: e.target.value }))
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomStatusManagement;
