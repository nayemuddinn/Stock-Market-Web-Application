# backend/Dockerfile
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Environment
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
