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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';

interface Room {
  id: string;
  name: string;
  basePrice: number;
}

interface PriceData {
  date: string;
  price: number;
  reason: string;
}

const PricingManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({
    price: 0,
    reason: 'DEFAULT',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom && startDate && endDate) {
      fetchPricing();
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

  const fetchPricing = async () => {
    if (!selectedRoom || !startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/admin/pricing', {
        params: {
          roomId: selectedRoom,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      });
      setPriceData(response.data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    const selectedRoomData = rooms.find(r => r.id === selectedRoom);
    setDialogData({
      price: selectedRoomData?.basePrice || 0,
      reason: 'DEFAULT',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdatePricing = async () => {
    if (!selectedRoom || !startDate || !endDate) return;

    try {
      await axios.post('/api/admin/pricing/bulk-update', {
        roomId: selectedRoom,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        price: dialogData.price,
        reason: dialogData.reason,
      });
      fetchPricing();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating pricing:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pricing Management
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
                  {room.name} (Base: ₹{room.basePrice})
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
          Update Pricing
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
                <TableCell>Date</TableCell>
                <TableCell align="right">Price (₹)</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {priceData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(data.date), 'MMMM d, yyyy')}</TableCell>
                  <TableCell align="right">₹{data.price}</TableCell>
                  <TableCell>{data.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Pricing</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={dialogData.price}
                onChange={(e) =>
                  setDialogData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
            </Grid>
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
                  <MenuItem value="DEFAULT">Default Price</MenuItem>
                  <MenuItem value="SEASON">Seasonal Price</MenuItem>
                  <MenuItem value="EVENT">Event Price</MenuItem>
                  <MenuItem value="SPECIAL">Special Offer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdatePricing} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PricingManagement;
