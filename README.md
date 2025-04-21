# Prakruthi Homestay

A full-stack homestay booking application for a luxury 2BHK villa.

## Live Demo
- Frontend: [https://prakruthi.srinovatech.site](https://prakruthi.srinovatech.site)
- API: [https://prakruthi-homestay-api.onrender.com](https://prakruthi-homestay-api.onrender.com)

## Tech Stack
- Frontend: React with TypeScript
- Backend: Spring Boot
- Database: MongoDB Atlas
- Authentication: JWT
- Payment: Razorpay
- Email: Resend
- Deployment: Vercel (Frontend) & Render (Backend)

## Features
- User authentication and authorization
- Room listing and details
- Booking management
- Payment integration
- Email notifications
- Admin dashboard
- Responsive design

## Local Development

### Prerequisites
- Node.js 16+
- Java 17
- Maven
- MongoDB

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your configuration
npm start
```

### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://prakruthi-homestay-api.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_Nb4Z9WyKMSAjzu
```

### Backend (application.yml)
Required environment variables:
- MONGODB_URI
- JWT_SECRET
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RESEND_API_KEY

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy

### Backend (Render)
1. Connect GitHub repository
2. Select Docker environment
3. Configure environment variables
4. Deploy

## API Documentation
API documentation is available at: `/api/swagger-ui.html`

## Testing
- Frontend: `npm test`
- Backend: `./mvnw test`

## License
MIT