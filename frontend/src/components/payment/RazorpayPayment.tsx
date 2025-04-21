import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useToast } from '../../hooks/useToast';
import api from '../../utils/axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  bookingId: string;
  amount: number;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  bookingId,
  amount,
  onSuccess,
  onFailure,
}) => {
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const initializePayment = async () => {
    try {
      // Create order
      const orderResponse = await api.post('/api/payments/create-order', {
        bookingId,
        amount,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Prakruthi Homestay',
        description: 'Villa Booking Payment',
        order_id: orderResponse.data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast('Payment successful!', 'success');
            onSuccess(verifyResponse.data);
          } catch (error) {
            showToast('Payment verification failed', 'error');
            onFailure(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          booking_id: bookingId,
        },
        theme: {
          color: '#2E7D32', // Green color from theme
        },
        modal: {
          ondismiss: () => {
            showToast('Payment cancelled', 'warning');
            onFailure(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showToast('Failed to initialize payment', 'error');
      onFailure(error);
    }
  };

  useEffect(() => {
    const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (script) {
      initializePayment();
    } else {
      const checkScript = setInterval(() => {
        const script = document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );
        if (script) {
          clearInterval(checkScript);
          initializePayment();
        }
      }, 100);

      return () => clearInterval(checkScript);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>Initializing payment...</Typography>
      <ToastComponent />
    </Box>
  );
};

export default RazorpayPayment;
