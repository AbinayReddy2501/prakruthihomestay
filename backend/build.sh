#!/bin/bash

# Install Maven if not present
if ! command -v mvn &> /dev/null; then
    echo "Maven not found. Installing Maven..."
    apt-get update
    apt-get install -y maven
fi

# Build the application
echo "Building Spring Boot application..."
mvn clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "JAR file created in target directory"
else
    echo "Build failed!"
    exit 1
fi
