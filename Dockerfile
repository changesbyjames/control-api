# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
# Use this if a shell is needed for debugging
# FROM node:22-alpine
# Use this for shell-less production
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

VOLUME ["/app/configs"]

CMD ["node", "dist/index.js"]
