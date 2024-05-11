FROM node:20.9.0-alpine3.18

WORKDIR /app

COPY . .

RUN npm install -g prisma
RUN prisma generate --schema=./schema.prisma

ARG POSTGRESQL_URL

ENV POSTGRESQL_URL=$POSTGRESQL_URL

CMD prisma migrate deploy --schema=./schema.prisma

