FROM node:20.9.0-alpine3.18 as build

WORKDIR /app

COPY . .

RUN npm i -g prisma
RUN prisma generate
RUN yarn install
RUN yarn build

FROM node:20.9.0-alpine3.18 as runtime

WORKDIR /app

RUN npm i -g pm2

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/dist ./dist

RUN yarn install --prod

EXPOSE 3000

CMD ["pm2-runtime", "./dist/index.js"]

