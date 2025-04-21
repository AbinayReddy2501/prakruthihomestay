#!/bin/bash

# Set default port if not set
export PORT=${PORT:-8080}

# Start the application
java -jar target/*.jar
