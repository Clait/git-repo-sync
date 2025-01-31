# Use Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port for the webhook server
EXPOSE 3000

# Command to run the script
CMD ["node", "webhook-server.js"]