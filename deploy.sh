#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Starting deployment process...${NC}"

# Step 1: Frontend Build
echo -e "${GREEN}Building Frontend...${NC}"
cd frontend
npm install
npm run build

# Step 2: Backend Build
echo -e "${GREEN}Building Backend...${NC}"
cd ../backend
./mvnw clean package -DskipTests

echo -e "${GREEN}Build completed successfully!${NC}"

# Step 3: Deployment Instructions
echo -e "\n${BLUE}Deployment Instructions:${NC}"
echo -e "${GREEN}1. Frontend (Vercel):${NC}"
echo "   - Push your code to GitHub"
echo "   - Go to vercel.com and import your repository"
echo "   - Set environment variables:"
echo "     REACT_APP_API_URL=https://prakruthi-homestay-api.onrender.com/api"
echo "     REACT_APP_RAZORPAY_KEY_ID=rzp_test_Nb4Z9WyKMSAjzu"

echo -e "\n${GREEN}2. Backend (Render):${NC}"
echo "   - Go to render.com and create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set build command: ./mvnw clean install"
echo "   - Set start command: java -jar target/*.jar"
echo "   - Add environment variables:"
echo "     SPRING_PROFILES_ACTIVE=prod"
echo "     JWT_SECRET=prakruthi_homestay_secret_key_2024_secure_jwt_token"
echo "     MONGODB_URI=mongodb+srv://prakruthi:Prakruthi1234@cluster0.kahoetc.mongodb.net/prakruthi_homestay"
echo "     RAZORPAY_KEY_ID=rzp_test_Nb4Z9WyKMSAjzu"
echo "     RAZORPAY_KEY_SECRET=cWLTHGXQ0h7sYckARPHYEkCJ"
echo "     RESEND_API_KEY=re_MvptJ5X3_FS7xQWG1rZLUFkGtBCtuVkCh"

echo -e "\n${GREEN}3. Domain Setup:${NC}"
echo "   - Add custom domain in Vercel: prakruthi.srinovatech.site"
echo "   - Configure DNS settings with your domain provider"

echo -e "\n${BLUE}Deployment process guide completed!${NC}"
