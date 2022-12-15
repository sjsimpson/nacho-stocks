FROM node:19-alpine

WORKDIR /app

# RUN yarn global add typescript

COPY . /app
RUN npm install

EXPOSE 8080
RUN npm run build
CMD ["npm", "run", "start"]
