FROM node:18
# RUN mkdir -p /app
WORKDIR /app/server
COPY package.json .
RUN npm install
COPY . .
# Value set in .env file.
EXPOSE 3003
CMD ["npm", "run", "start"]
