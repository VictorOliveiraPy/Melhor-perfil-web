FROM node:20-bullseye-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false

FROM node:20-bullseye-slim AS base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
