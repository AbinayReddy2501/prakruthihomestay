#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Java and Maven
apt-get update
apt-get install -y openjdk-17-jdk maven

# Build the application
mvn clean package -DskipTests
