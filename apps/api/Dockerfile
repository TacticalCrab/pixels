FROM node:20-alpine as runner

WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma migrate dev

EXPOSE 3001
EXPOSE 3002

CMD ["npm", "run", "prod"]