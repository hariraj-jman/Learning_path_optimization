# Stage 1: Build the React application
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install development dependencies
RUN npm install --only=development

# Expose port 3000 for the development server
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]