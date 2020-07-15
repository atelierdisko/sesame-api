#!/usr/bin/env sh

cp .env.docker .env
docker-compose up -d
docker-compose exec node npm install

docker-compose logs -f
