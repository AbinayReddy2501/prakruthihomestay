import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Chip,
} from '@mui/material';
import {
  KingBed,
  Bathtub,
  Kitchen,
  Tv,
  Wifi,
  LocalParking,
  AcUnit,
  Balcony,
  CleaningServices,
  Security,
  Landscape,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ImageGallery from '../../components/gallery/ImageGallery';
import { useRoom } from '../../hooks/useRoom';
import { useToast } from '../../hooks/useToast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const amenityIcons: { [key: string]: React.ReactElement } = {
  'Bedrooms': <KingBed className="amenity-icon" />,
  'Bathrooms': <Bathtub className="amenity-icon" />,
  'Kitchen': <Kitchen className="amenity-icon" />,
  'TV': <Tv className="amenity-icon" />,
  'Wi-Fi': <Wifi className="amenity-icon" />,
  'Parking': <LocalParking className="amenity-icon" />,
  'AC': <AcUnit className="amenity-icon" />,
  'Balcony': <Balcony className="amenity-icon" />,
  'Housekeeping': <CleaningServices className="amenity-icon" />,
  'Security': <Security className="amenity-icon" />,
  'Garden View': <Landscape className="amenity-icon" />,
};

const villaImages = [
  {
    url: '/images/villa/exterior.jpg',
    title: 'Villa Exterior',
    description: 'Modern 2BHK villa with beautiful night lighting',
  },
  {
    url: '/images/villa/interior/kitchen.jpg',
    title: 'Modern Kitchen',
    description: 'Fully equipped kitchen with modern amenities',
  },
  {
    url: '/images/villa/interior/bedroom.jpg',
    title: 'Comfortable Bedroom',
    description: 'Air-conditioned bedroom with modern decor',
  },
  {
    url: '/images/villa/garden-night.jpg',
    title: 'Garden View',
    description: 'Beautiful garden area with night lighting',
  }
];

const amenities = [
  {
    icon: 'kitchen',
    title: 'Fully Equipped Kitchen',
    description: 'Modern kitchen with all necessary appliances'
  },
  {
    icon: 'ac_unit',
    title: 'Air Conditioning',
    description: 'Split AC units in all rooms'
  },
  {
    icon: 'wifi',
    title: 'Free WiFi',
    description: 'High-speed internet access'
  },
  {
    icon: 'local_parking',
    title: 'Parking',
    description: 'Free parking on premises'
  },
  {
    icon: 'park',
    title: 'Garden Area',
    description: 'Beautiful landscaped garden'
  },
  {
    icon: 'security',
    title: '24/7 Security',
    description: 'Round-the-clock security'
  }
];

const RoomListingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { rooms, loading, fetchRooms } = useRoom();
  const { showToast, ToastComponent } = useToast();
  const [checkInDate, setCheckInDate] = React.useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    fetchRooms();
  }, []);

  const handleBookNow = (roomId: string) => {
    if (!checkInDate || !checkOutDate) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }
    navigate('/booking', {
      state: {
        roomId,
        checkInDate,
        checkOutDate,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <img 
          src="/images/logo.svg" 
          alt="Prakruthi Homestay" 
          style={{ height: '100px', marginBottom: '1rem' }}
        />
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome to Prakruthi Homestay
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Experience tranquility in our luxury 2BHK villa
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Gallery
        </Typography>
        <ImageGallery images={villaImages} />
      </Box>

      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid item xs={12} md={8} key={room.id}>
            <Card className="hover-card fade-in">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {room.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {room.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      icon={amenityIcons[amenity.icon]}
                      label={amenity.title}
                      sx={{ mr: 1, mb: 1 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ₹{room.basePrice} / night
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/booking/${room.id}`)}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Check Availability
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Check-in Date"
                    value={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    sx={{ width: '100%', mb: 2 }}
                  />
                  <DatePicker
                    label="Check-out Date"
                    value={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    sx={{ width: '100%' }}
                    minDate={checkInDate ? new Date(checkInDate) : undefined}
                  />
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastComponent />
    </Container>
  );
};

export default RoomListingPage;
