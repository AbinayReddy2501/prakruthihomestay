import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchUserBookings,
  createBooking,
  cancelBooking,
  getBookingDetails,
} from '../store/slices/bookingSlice';

export const useBooking = () => {
  const dispatch = useDispatch();
  const { bookings, selectedBooking, loading, error } = useSelector(
    (state: RootState) => state.booking
  );

  const handleFetchBookings = () => {
    dispatch(fetchUserBookings());
  };

  const handleCreateBooking = (bookingData: any) => {
    dispatch(createBooking(bookingData));
  };

  const handleCancelBooking = (bookingId: string) => {
    dispatch(cancelBooking(bookingId));
  };

  const handleGetBookingDetails = (bookingId: string) => {
    dispatch(getBookingDetails(bookingId));
  };

  return {
    bookings,
    selectedBooking,
    loading,
    error,
    fetchBookings: handleFetchBookings,
    createBooking: handleCreateBooking,
    cancelBooking: handleCancelBooking,
    getBookingDetails: handleGetBookingDetails,
  };
};
