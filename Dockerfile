FROM node:6

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -yy -qq && \
    apt-get install yarn -yy -qq

ADD package.json yarn.lock packages /app/

RUN yarn --pure-lockfile --ignore-scripts
RUN ls
RUN cd packages && ls
RUN cd packages/service-worker-mock/ && yarn  --pure-lockfile --ignore-scripts

ADD . /app
