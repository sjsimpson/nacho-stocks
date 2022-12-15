FROM node:19-alpine

WORKDIR /app

# RUN yarn global add typescript

COPY . /app
RUN npm install

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD ["yarn", "start"]
