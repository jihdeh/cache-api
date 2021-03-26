FROM node:14

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/

RUN yarn --pure-lockfile

ADD . /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
