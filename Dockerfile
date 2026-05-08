FROM node:20-alpine

WORKDIR /app

# Install deps first for better caching
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy the rest
COPY . .

EXPOSE 5173

# Vite must listen on 0.0.0.0 inside containers
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]

