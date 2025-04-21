import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DashboardData {
  todayCheckIns: any[];
  todayCheckOuts: any[];
  occupiedRooms: any[];
  pendingRequests: any[];
}

const ManagerDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/manager/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Manager Dashboard</Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Today's Check-ins */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Check-ins
              </Typography>
              <List>
                {data?.todayCheckIns.map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemText
                      primary={booking.guestDetails.name}
                      secondary={`Room ${booking.roomName} | Expected: ${format(
                        new Date(booking.checkInTime),
                        'hh:mm a'
                      )}`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => navigate(`/manager/check-in/${booking.id}`)}
                      >
                        Process
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Check-outs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Check-outs
              </Typography>
              <List>
                {data?.todayCheckOuts.map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemText
                      primary={booking.guestDetails.name}
                      secondary={`Room ${booking.roomName} | Expected: ${format(
                        new Date(booking.checkOutTime),
                        'hh:mm a'
                      )}`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        startIcon={<ExitToAppIcon />}
                        onClick={() => navigate(`/manager/check-out/${booking.id}`)}
                      >
                        Process
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Currently Occupied Rooms */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Occupied Rooms
              </Typography>
              <List>
                {data?.occupiedRooms.map((room) => (
                  <ListItem key={room.id} divider>
                    <ListItemText
                      primary={`Room ${room.name}`}
                      secondary={`Guest: ${room.currentGuest}`}
                    />
                    <Chip
                      label={room.status}
                      color={room.status === 'OCCUPIED' ? 'primary' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Guest Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Requests
              </Typography>
              <List>
                {data?.pendingRequests.map((request) => (
                  <ListItem key={request.id} divider>
                    <ListItemText
                      primary={request.type}
                      secondary={`Room ${request.roomName} | ${request.description}`}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/manager/guest-requests/${request.id}`)}
                    >
                      Handle
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManagerDashboard;
