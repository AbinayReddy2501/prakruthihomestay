import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <HotelIcon fontSize="large" />,
      title: 'Comfortable Rooms',
      description: 'Spacious and well-furnished rooms for a relaxing stay',
    },
    {
      icon: <RestaurantIcon fontSize="large" />,
      title: 'Home-cooked Meals',
      description: 'Authentic local cuisine prepared with care',
    },
    {
      icon: <WifiIcon fontSize="large" />,
      title: 'Free Wi-Fi',
      description: 'High-speed internet throughout the property',
    },
    {
      icon: <LocalParkingIcon fontSize="large" />,
      title: 'Parking Available',
      description: 'Secure parking space for your vehicles',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          position: 'relative',
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Prakruthi Homestay
          </Typography>
          <Typography variant="h5" paragraph>
            Experience the perfect blend of comfort and nature
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/rooms')}
          >
            Book Now
          </Button>
        </Container>
      </Box>

      {/* Check-in/Check-out Times */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <AccessTimeIcon color="primary" fontSize="large" />
              </Grid>
              <Grid item xs>
                <Typography variant="h6" gutterBottom>
                  Check-in/Check-out Times
                </Typography>
                <Typography variant="body1">
                  Check-in: 1:00 PM | Check-out: 11:00 AM
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Our Amenities
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                About Our Homestay
              </Typography>
              <Typography variant="body1" paragraph>
                Nestled in the heart of nature, Prakruthi Homestay offers a unique blend of modern comfort
                and natural serenity. Our homestay is designed to provide you with an authentic local
                experience while ensuring all your needs are met.
              </Typography>
              <Typography variant="body1" paragraph>
                With spacious rooms, home-cooked meals, and a peaceful environment, we strive to make
                your stay memorable and comfortable.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image="/images/homestay-exterior.jpg"
                  alt="Prakruthi Homestay"
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
