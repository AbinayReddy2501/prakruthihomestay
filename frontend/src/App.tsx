import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from './theme';
import { store } from './store';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import HomePage from './pages/public/HomePage';
import RoomListingPage from './pages/public/RoomListingPage';
import BookingPage from './pages/public/BookingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User dashboard pages
import UserDashboard from './pages/user/UserDashboard';
import BookingHistory from './pages/user/BookingHistory';
import UserProfile from './pages/user/UserProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingManagement from './pages/admin/BookingManagement';
import RoomManagement from './pages/admin/RoomManagement';
import AvailabilityManagement from './pages/admin/AvailabilityManagement';
import PricingManagement from './pages/admin/PricingManagement';
import UserManagement from './pages/admin/UserManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CheckInManagement from './pages/manager/CheckInManagement';
import CheckOutManagement from './pages/manager/CheckOutManagement';
import RoomStatusManagement from './pages/manager/RoomStatusManagement';
import GuestRequestManagement from './pages/manager/GuestRequestManagement';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomListingPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <BookingManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <RoomManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/availability"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AvailabilityManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pricing"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <PricingManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EmployeeManagement />
                </ProtectedRoute>
              }
            />

            {/* Manager routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/check-in/:bookingId"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <CheckInManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/check-out/:bookingId"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <CheckOutManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/room-status"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <RoomStatusManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/guest-requests"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <GuestRequestManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
