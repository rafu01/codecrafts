FROM node:20-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

COPY config ./

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/handler.js" ]