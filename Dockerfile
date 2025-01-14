# Use the Node.js LTS image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript to JavaScript (if you're using TypeScript)
RUN npm install -g typescript
RUN tsc

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["node", "build/audioSignalingServer.js"]