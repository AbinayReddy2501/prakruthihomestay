import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, differenceInDays } from 'date-fns';
import { useRoom } from '../../hooks/useRoom';
import { useToast } from '../../hooks/useToast';

interface RoomBookingFormProps {
  roomId: string;
  onBookingComplete: (bookingData: any) => void;
}

const RoomBookingForm: React.FC<RoomBookingFormProps> = ({ roomId, onBookingComplete }) => {
  const { selectedRoom, getRoomDetails, checkAvailability, getRoomPricing } = useRoom();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    numberOfGuests: 1,
    specialRequests: '',
    termsAccepted: false,
  });
  const [pricing, setPricing] = useState({
    totalAmount: 0,
    breakdown: [] as any[],
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      checkAvailabilityAndPricing();
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  const fetchRoomDetails = async () => {
    try {
      await getRoomDetails(roomId);
    } catch (error) {
      showToast('Error fetching room details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailabilityAndPricing = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) return;

    const params = {
      roomId,
      startDate: format(formData.checkInDate, 'yyyy-MM-dd'),
      endDate: format(formData.checkOutDate, 'yyyy-MM-dd'),
    };

    try {
      const [availabilityResponse, pricingResponse] = await Promise.all([
        checkAvailability(params),
        getRoomPricing(params),
      ]);

      if (!availabilityResponse.available) {
        showToast('Room is not available for selected dates', 'error');
        return;
      }

      setPricing(pricingResponse);
    } catch (error) {
      showToast('Error checking availability and pricing', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (field: 'checkInDate' | 'checkOutDate', date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      showToast('Please accept the terms and conditions', 'error');
      return;
    }

    const bookingData = {
      ...formData,
      roomId,
      totalAmount: pricing.totalAmount,
      checkInDate: format(formData.checkInDate!, 'yyyy-MM-dd'),
      checkOutDate: format(formData.checkOutDate!, 'yyyy-MM-dd'),
    };

    onBookingComplete(bookingData);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Booking Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-in Date"
                value={formData.checkInDate}
                onChange={(date) => handleDateChange('checkInDate', date)}
                minDate={new Date()}
                maxDate={addDays(new Date(), 90)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-out Date"
                value={formData.checkOutDate}
                onChange={(date) => handleDateChange('checkOutDate', date)}
                minDate={formData.checkInDate ? addDays(formData.checkInDate, 1) : new Date()}
                maxDate={addDays(new Date(), 90)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Guests"
              name="numberOfGuests"
              type="number"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1, max: selectedRoom?.capacity || 1 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Requests"
              name="specialRequests"
              multiline
              rows={3}
              value={formData.specialRequests}
              onChange={handleInputChange}
            />
          </Grid>

          {pricing.totalAmount > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Price Breakdown
              </Typography>
              <Box sx={{ mb: 2 }}>
                {pricing.breakdown.map((item: any, index: number) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <Typography variant="body2">
                      {format(new Date(item.date), 'MMM d, yyyy')}
                    </Typography>
                    <Typography variant="body2">₹{item.price}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Total Amount</Typography>
                  <Typography variant="subtitle1">₹{pricing.totalAmount}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
              }
              label="I accept the terms and conditions"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!formData.checkInDate || !formData.checkOutDate || !formData.termsAccepted}
            >
              Proceed to Payment
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastComponent />
    </Paper>
  );
};

export default RoomBookingForm;
