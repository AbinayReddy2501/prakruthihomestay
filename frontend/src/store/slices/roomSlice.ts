import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RoomState {
  rooms: any[];
  selectedRoom: any | null;
  availability: any[];
  pricing: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  availability: [],
  pricing: [],
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/rooms');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
    }
  }
);

export const getRoomDetails = createAsyncThunk(
  'room/getRoomDetails',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/rooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room details');
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'room/checkAvailability',
  async (
    {
      roomId,
      startDate,
      endDate,
    }: { roomId: string; startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get('/api/rooms/availability', {
        params: { roomId, startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check availability');
    }
  }
);

export const getRoomPricing = createAsyncThunk(
  'room/getRoomPricing',
  async (
    {
      roomId,
      startDate,
      endDate,
    }: { roomId: string; startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get('/api/rooms/pricing', {
        params: { roomId, startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pricing');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    clearAvailability: (state) => {
      state.availability = [];
    },
    clearPricing: (state) => {
      state.pricing = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Rooms
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms = action.payload;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Room Details
    builder.addCase(getRoomDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRoomDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedRoom = action.payload;
    });
    builder.addCase(getRoomDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Check Availability
    builder.addCase(checkAvailability.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAvailability.fulfilled, (state, action) => {
      state.loading = false;
      state.availability = action.payload;
    });
    builder.addCase(checkAvailability.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Room Pricing
    builder.addCase(getRoomPricing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRoomPricing.fulfilled, (state, action) => {
      state.loading = false;
      state.pricing = action.payload;
    });
    builder.addCase(getRoomPricing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedRoom, clearAvailability, clearPricing, clearError } =
  roomSlice.actions;
export default roomSlice.reducer;
