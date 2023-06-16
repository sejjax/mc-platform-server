FROM node:18.16.0

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=production

WORKDIR /app
COPY ["package.json","yarn.lock","tsconfig.json","ecosystem.config.js", "tsconfig.build.json", "./"]

RUN yarn install && yarn global add pm2

RUN npm i -g @nestjs/cli@9.0.0

COPY . .

RUN yarn build

COPY /src/mail/templates/ ./mail/templates/

VOLUME /app

EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]