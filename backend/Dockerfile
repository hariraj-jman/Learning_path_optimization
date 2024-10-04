# Use the official Node.js image as the base image
FROM node:16-alpine

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

# RUN npx prisma generate
# RUN npx prisma migrate deploy

# Expose port 3000 for the backend server
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "dev"]