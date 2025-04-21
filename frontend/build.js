const fs = require('fs');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}Starting production build process...${colors.reset}\n`);

// Step 1: Check for environment variables
console.log(`${colors.green}Checking environment variables...${colors.reset}`);
const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_RAZORPAY_KEY_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`${colors.red}Error: Missing required environment variables:${colors.reset}`);
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
  process.exit(1);
}

// Step 2: Clean previous build
console.log(`\n${colors.green}Cleaning previous build...${colors.reset}`);
try {
  if (fs.existsSync('./build')) {
    fs.rmSync('./build', { recursive: true });
  }
} catch (error) {
  console.error(`${colors.red}Error cleaning build directory:${colors.reset}`, error);
  process.exit(1);
}

// Step 3: Install dependencies
console.log(`\n${colors.green}Installing dependencies...${colors.reset}`);
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Error installing dependencies:${colors.reset}`, error);
  process.exit(1);
}

// Step 4: Run build
console.log(`\n${colors.green}Building production bundle...${colors.reset}`);
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Error building production bundle:${colors.reset}`, error);
  process.exit(1);
}

// Step 5: Verify build
console.log(`\n${colors.green}Verifying build...${colors.reset}`);
if (!fs.existsSync('./build')) {
  console.error(`${colors.red}Error: Build directory not found${colors.reset}`);
  process.exit(1);
}

console.log(`\n${colors.blue}Build completed successfully!${colors.reset}`);
console.log(`\n${colors.green}Next steps:${colors.reset}`);
console.log('1. Deploy to Vercel using:');
console.log('   vercel --prod');
console.log('2. Configure custom domain:');
console.log('   prakruthi.srinovatech.site');
