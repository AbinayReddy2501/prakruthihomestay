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
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

interface CheckOutForm {
  roomCondition: string;
  additionalCharges: number;
  additionalChargesReason: string;
  damagesReported: boolean;
  damagesDescription: string;
  cleaningRequired: boolean;
  notes: string;
}

const CheckOutManagement = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<CheckOutForm>({
    roomCondition: '',
    additionalCharges: 0,
    additionalChargesReason: '',
    damagesReported: false,
    damagesDescription: '',
    cleaningRequired: false,
    notes: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCompleteCheckOut = async () => {
    try {
      await axios.post(`/api/manager/process-checkout/${bookingId}`, formData);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error processing check-out:', error);
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
        Process Check-out
      </Typography>

      <Grid container spacing={3}>
        {/* Booking Details Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Guest Name"
                        secondary={booking.guestDetails.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Room"
                        secondary={booking.roomName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Check-in Date"
                        secondary={format(new Date(booking.checkInDate), 'MMMM d, yyyy')}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Total Amount"
                        secondary={`₹${booking.totalAmount}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Payment Status"
                        secondary={booking.paymentStatus}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Duration of Stay"
                        secondary={`${booking.numberOfNights} nights`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Check-out Form */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Check-out Form
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Room Condition"
                    name="roomCondition"
                    multiline
                    rows={3}
                    value={formData.roomCondition}
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
                    label="Additional Charges Reason"
                    name="additionalChargesReason"
                    value={formData.additionalChargesReason}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.damagesReported}
                        onChange={handleInputChange}
                        name="damagesReported"
                      />
                    }
                    label="Damages Reported"
                  />
                </Grid>

                {formData.damagesReported && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Damages Description"
                      name="damagesDescription"
                      multiline
                      rows={3}
                      value={formData.damagesDescription}
                      onChange={handleInputChange}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.cleaningRequired}
                        onChange={handleInputChange}
                        name="cleaningRequired"
                      />
                    }
                    label="Special Cleaning Required"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleCompleteCheckOut}
                >
                  Complete Check-out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Check-out Completed</DialogTitle>
        <DialogContent>
          <Typography>
            The guest has been successfully checked out. A receipt has been sent to their email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/manager')}>Return to Dashboard</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckOutManagement;
