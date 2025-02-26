# Use the official Node.js image with the specific version
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Copy the rest of the project files
COPY . .

# Install the project dependencies
RUN npm run build 

# Expose the port Server is running on (default is 3000)
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production 
ENV GENERATE_SOURCEMAP=false

# Run Server in production mode
CMD [ "npm","run","start" ]