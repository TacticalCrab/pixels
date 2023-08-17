FROM node:20-alpine as runner

WORKDIR /app

COPY . .
RUN npm install


EXPOSE 3000

CMD ["npm", "run", "prod"]