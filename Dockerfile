# Use an official Node.js image
FROM node:16-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    apt-get install -y libx11-xcb1 libxcomposite1 libxrandr2 libxi6 libatk1.0-0 libcups2 libpangocairo-1.0-0 libnss3 libgdk-pixbuf2.0-0 libxdamage1 libxkbcommon0 libxshmfence1 && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
