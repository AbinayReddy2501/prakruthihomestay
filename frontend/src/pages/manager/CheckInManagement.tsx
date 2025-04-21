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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const steps = ['Verify Guest Details', 'Collect ID Proof', 'Room Assignment', 'Complete Check-in'];

const CheckInManagement = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    idProofType: '',
    idProofNumber: '',
    idProofImage: null as File | null,
    actualRoomNumber: '',
    additionalNotes: '',
    additionalCharges: 0,
    additionalChargesReason: '',
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/manager/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        idProofImage: event.target.files![0],
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompleteCheckIn = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      await axios.post(`/api/manager/process-checkin/${bookingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOpenDialog(true);
    } catch (error) {
      console.error('Error processing check-in:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Process Check-in
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Guest Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Name:</strong> {booking.guestDetails.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {booking.guestDetails.email}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {booking.guestDetails.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Check-in Date:</strong>{' '}
                  {format(new Date(booking.checkInDate), 'MMMM d, yyyy')}
                </Typography>
                <Typography>
                  <strong>Check-out Date:</strong>{' '}
                  {format(new Date(booking.checkOutDate), 'MMMM d, yyyy')}
                </Typography>
                <Typography>
                  <strong>Number of Guests:</strong> {booking.guestDetails.numberOfGuests}
                </Typography>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>ID Proof Type</InputLabel>
                  <Select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={(e) => handleInputChange(e as any)}
                  >
                    <MenuItem value="PASSPORT">Passport</MenuItem>
                    <MenuItem value="DRIVING_LICENSE">Driving License</MenuItem>
                    <MenuItem value="AADHAR">Aadhar Card</MenuItem>
                    <MenuItem value="VOTER_ID">Voter ID</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID Proof Number"
                  name="idProofNumber"
                  value={formData.idProofNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Upload ID Proof
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.idProofImage && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {formData.idProofImage.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room Number"
                  name="actualRoomNumber"
                  value={formData.actualRoomNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="additionalNotes"
                  multiline
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Additional Charges"
                  name="additionalCharges"
                  type="number"
                  value={formData.additionalCharges}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Charges Reason"
                  name="additionalChargesReason"
                  value={formData.additionalChargesReason}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Confirm Check-in
              </Typography>
              <Typography>
                Please review all details and confirm the check-in process.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleCompleteCheckIn : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Complete Check-in' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Check-in Completed</DialogTitle>
        <DialogContent>
          <Typography>
            The guest has been successfully checked in. A welcome email has been sent with all
            necessary information.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/manager')}>Return to Dashboard</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckInManagement;
