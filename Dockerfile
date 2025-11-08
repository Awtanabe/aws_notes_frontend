FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

# CMD ["npm", "run", "start"]
