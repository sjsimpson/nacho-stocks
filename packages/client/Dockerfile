FROM node:19-alpine

WORKDIR /app

# RUN yarn global add typescript

COPY . /app
RUN npm install

CMD ["yarn", "dev"]
