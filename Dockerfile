FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

# generated prisma files
COPY prisma ./prisma/

RUN yarn install

# Bundle app source
# RUN yarn build

COPY dist/ .

EXPOSE 3001
CMD [ "node", "index.js" ]

