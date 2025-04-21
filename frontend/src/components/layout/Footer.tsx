import React from 'react';
import { Box, Container, Typography, Link, Grid, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Phone: +91 9876543210
              <br />
              Email: info@prakruthihomestay.com
              <br />
              Address: Prakruthi Homestay, Bangalore
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link href="/rooms" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Rooms
            </Link>
            <Link href="/booking" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Book Now
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" paragraph>
              Experience luxury and comfort in our modern 2BHK villa surrounded by nature.
            </Typography>
            <Box component="img" 
                 src="/images/logo.svg" 
                 alt="Prakruthi Homestay"
                 sx={{ height: 60, mb: 2 }} 
            />
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="inherit">
            {new Date().getFullYear()} Prakruthi Homestay. All rights reserved.
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
            Designed and Developed by{' '}
            <Link 
              href="https://srinovatech.site" 
              target="_blank" 
              rel="noopener noreferrer"
              color="inherit"
              sx={{ textDecoration: 'underline' }}
            >
              SrinovaTech
            </Link>
            {' '}(Sreekar and Abinay)
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
