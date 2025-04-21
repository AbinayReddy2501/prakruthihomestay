import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePayment } from '../../hooks/usePayment';
import RoomBookingForm from '../../components/booking/RoomBookingForm';

const steps = ['Room Details', 'Booking Information', 'Payment'];

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRoom, getRoomDetails } = useRoom();
  const { isAuthenticated } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const { initializePayment, loading: paymentLoading } = usePayment({
    onSuccess: (data) => {
      showToast('Booking confirmed successfully!', 'success');
      navigate('/bookings/' + data.bookingId);
    },
    onError: (error) => {
      showToast(error.message || 'Payment failed', 'error');
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const { roomId } = location.state || {};

  useEffect(() => {
    if (!roomId) {
      navigate('/rooms');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      await getRoomDetails(roomId);
    } catch (error) {
      showToast('Error fetching room details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = (data: any) => {
    setBookingData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (response: any) => {
    setBookingComplete(true);
    showToast('Booking confirmed successfully!', 'success');
  };

  const handlePaymentFailure = (error: any) => {
    showToast('Payment failed. Please try again.', 'error');
    setShowPayment(false);
  };

  const handleCloseBookingComplete = () => {
    navigate('/bookings');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedRoom) {
    return (
      <Container>
        <Typography>Room not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={selectedRoom.images[0]}
              alt={selectedRoom.name}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedRoom.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedRoom.description}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Base Price: ₹{selectedRoom.basePrice}/night
              </Typography>
              <Typography variant="body2">
                Maximum Capacity: {selectedRoom.capacity} guests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <RoomBookingForm
            roomId={roomId}
            onBookingComplete={handleBookingComplete}
          />
        </Grid>
      </Grid>

      {showPayment && bookingData && (
        <RazorpayPayment
          amount={bookingData.totalAmount}
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}

      <Dialog open={bookingComplete} onClose={handleCloseBookingComplete}>
        <DialogTitle>Booking Confirmed!</DialogTitle>
        <DialogContent>
          <Typography>
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingComplete}>View My Bookings</Button>
        </DialogActions>
      </Dialog>

      <ToastComponent />
    </Container>
  );
};

export default BookingPage;
