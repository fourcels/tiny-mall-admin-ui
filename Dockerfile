FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV production

COPY /next.config.js ./
COPY /public ./public
COPY /package.json ./package.json
COPY /.next ./.next
COPY /node_modules ./node_modules


EXPOSE 3000

CMD ["yarn", "start"]