# frontend/Dockerfile

# --- Build stage ---
FROM node:22-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build with API base URL baked in
# Change this to your desired backend URL if needed
ARG VITE_API_BASE_URL=http://localhost:5000/api/stocks
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
