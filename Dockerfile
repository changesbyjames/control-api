FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production
USER node
VOLUME ["/app/configs"]
CMD ["node", "dist/index.js"]
