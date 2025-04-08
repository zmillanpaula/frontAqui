FROM node:18-bullseye AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]