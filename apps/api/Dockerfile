FROM node:20-alpine as runner

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev

EXPOSE 3001
EXPOSE 3002

CMD ["npm", "run", "prod"]