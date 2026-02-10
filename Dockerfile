FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN && npm prune --production

VOLUME ["/app/configs"]
CMD ["npm", "start"]
