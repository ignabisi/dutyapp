FROM node:16-alpine

WORKDIR /usr/src/app

# Compiler dependencies because of Apline img
RUN apk add --no-cache \
    python3 \
    make \
    gcc \
    g++ \
    libffi-dev \
    musl-dev

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

# Delete compiler dependencies
RUN apk del python3 make gcc g++ libffi-dev musl-dev

EXPOSE 3000

# TODO
CMD ["npx", "ts-node", "src/server.ts"]