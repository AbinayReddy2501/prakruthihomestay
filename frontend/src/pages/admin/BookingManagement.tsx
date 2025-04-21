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
  TextField,
  Button,
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
  IconButton,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';

interface Booking {
  id: string;
  bookingId: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    searchQuery: '',
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/bookings', {
        params: {
          status: filters.status || undefined,
          startDate: filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : undefined,
          endDate: filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : undefined,
          search: filters.searchQuery || undefined,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleOpenCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenCancelDialog(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await axios.put(`/api/admin/bookings/${selectedBooking.id}/cancel`, {
        reason: cancelReason,
      });
      fetchBookings();
      setOpenCancelDialog(false);
      setCancelReason('');
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'CHECKED_IN':
        return 'info';
      case 'CHECKED_OUT':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CHECKED_IN">Checked In</MenuItem>
              <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={filters.startDate}
              onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Date"
              value={filters.endDate}
              onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          />
        </Grid>
      </Grid>

      {/* Bookings Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.bookingId}</TableCell>
                  <TableCell>{booking.guestDetails.name}</TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>{format(new Date(booking.checkInDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.checkOutDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">₹{booking.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewBooking(booking)} size="small">
                      <VisibilityIcon />
                    </IconButton>
                    {booking.status === 'CONFIRMED' && (
                      <IconButton
                        onClick={() => handleOpenCancelDialog(booking)}
                        size="small"
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Booking Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Guest Information</Typography>
                <Typography>Name: {selectedBooking.guestDetails.name}</Typography>
                <Typography>Email: {selectedBooking.guestDetails.email}</Typography>
                <Typography>Phone: {selectedBooking.guestDetails.phone}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Booking Information</Typography>
                <Typography>Room: {selectedBooking.roomName}</Typography>
                <Typography>
                  Check-in: {format(new Date(selectedBooking.checkInDate), 'MMMM d, yyyy')}
                </Typography>
                <Typography>
                  Check-out: {format(new Date(selectedBooking.checkOutDate), 'MMMM d, yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Payment Information</Typography>
                <Typography>Total Amount: ₹{selectedBooking.totalAmount}</Typography>
                <Typography>Payment Status: {selectedBooking.paymentStatus}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cancellation Reason"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Cancel</Button>
          <Button onClick={handleCancelBooking} variant="contained" color="error">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingManagement;
