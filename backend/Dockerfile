# Build stage
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app

# Copy pom.xml for dependency resolution
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy jar from build stage
COPY --from=builder /app/target/*.jar app.jar

# Create logs directory
RUN mkdir -p /var/log/prakruthi-homestay

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
