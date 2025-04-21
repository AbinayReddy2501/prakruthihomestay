import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchRooms,
  getRoomDetails,
  checkAvailability,
  getRoomPricing,
} from '../store/slices/roomSlice';

export const useRoom = () => {
  const dispatch = useDispatch();
  const { rooms, selectedRoom, availability, pricing, loading, error } = useSelector(
    (state: RootState) => state.room
  );

  const handleFetchRooms = () => {
    dispatch(fetchRooms());
  };

  const handleGetRoomDetails = (roomId: string) => {
    dispatch(getRoomDetails(roomId));
  };

  const handleCheckAvailability = (params: {
    roomId: string;
    startDate: string;
    endDate: string;
  }) => {
    dispatch(checkAvailability(params));
  };

  const handleGetRoomPricing = (params: {
    roomId: string;
    startDate: string;
    endDate: string;
  }) => {
    dispatch(getRoomPricing(params));
  };

  return {
    rooms,
    selectedRoom,
    availability,
    pricing,
    loading,
    error,
    fetchRooms: handleFetchRooms,
    getRoomDetails: handleGetRoomDetails,
    checkAvailability: handleCheckAvailability,
    getRoomPricing: handleGetRoomPricing,
  };
};
