# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker's cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

RUN apk add --no-cache openssl

EXPOSE 5000

# Run Prisma migrations when the container starts
CMD ["sh", "-c", "npm start"]


