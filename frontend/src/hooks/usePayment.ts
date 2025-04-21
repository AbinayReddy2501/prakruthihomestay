import { useState } from 'react';
import api from '../utils/axios';
import { useToast } from './useToast';

interface PaymentHookProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const usePayment = ({ onSuccess, onError }: PaymentHookProps = {}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const initializePayment = async (bookingId: string, amount: number) => {
    try {
      setLoading(true);

      // Create order
      const orderResponse = await api.post('/api/payments/create-order', {
        bookingId,
        amount,
      });

      const options = {
        key: 'rzp_test_Nb4Z9WyKMSAjzu', // Your Razorpay Key ID
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Prakruthi Homestay',
        description: 'Villa Booking Payment',
        order_id: orderResponse.data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast('Payment successful!', 'success');
            onSuccess?.(verifyResponse.data);
          } catch (error) {
            showToast('Payment verification failed', 'error');
            onError?.(error);
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
          color: '#2E7D32',
        },
        modal: {
          ondismiss: () => {
            showToast('Payment cancelled', 'warning');
            onError?.(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      showToast('Failed to initialize payment', 'error');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/payments/refund', { bookingId });
      showToast('Refund processed successfully', 'success');
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      showToast('Failed to process refund', 'error');
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = async (paymentId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      showToast('Failed to fetch payment status', 'error');
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    initializePayment,
    processRefund,
    getPaymentStatus,
  };
};
