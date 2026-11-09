
FROM mcr.microsoft.com/playwright:v1.65.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
