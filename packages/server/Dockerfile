FROM node:18
# RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
# Value set in .env file.
RUN npm run build

EXPOSE 3003
CMD ["npm", "run", "start"]
