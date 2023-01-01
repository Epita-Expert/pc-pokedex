FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# generated prisma files
COPY prisma ./prisma/

RUN yarn prisma generate

COPY dist/ .

EXPOSE 3001
CMD [ "node", "src/index.js" ]
