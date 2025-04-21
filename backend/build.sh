#!/bin/bash
set -e

echo "Installing dependencies..."
apt-get update
apt-get install -y maven

echo "Building application..."
mvn clean package -DskipTests
