FROM node:18

WORKDIR /app
COPY . /app

ENV PORT 8080
ENV HOST 0.0.0.0

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]
