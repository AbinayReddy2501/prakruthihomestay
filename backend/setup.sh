#!/bin/bash

# Download Maven wrapper
mvn -N io.takari:maven:wrapper

# Make mvnw executable
chmod +x mvnw

# Clean and package
./mvnw clean package -DskipTests
