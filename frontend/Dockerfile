FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make gcc g++ libffi-dev musl-dev

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN apk del python3 make gcc g++ libffi-dev musl-dev

EXPOSE 3000

CMD ["yarn", "start"]
