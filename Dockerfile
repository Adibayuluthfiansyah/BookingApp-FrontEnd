# Docker Image For Development 
FROM node:20-alpine

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Expose port 3000 for running the app
EXPOSE 3000

# Perintah default untuk menjalankan server development
CMD ["npm", "run", "dev"]