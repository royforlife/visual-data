FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install

COPY . .

RUN tsc

EXPOSE 3000

CMD ["node", "dist/app.js"]
