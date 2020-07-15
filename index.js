'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Redis = require("redis");
const CryptoJS = require("crypto-js");
const {promisify} = require("util");

const lifetimes = {
  '10 minutes': 60 * 10,
  '1 hour': 60 * 60,
  '2 hours': 60 * 60 * 2,
  '8 hours': 60 * 60 * 8,
  '1 day': 60 * 60 * 24,
  '7 days': 60 * 60 * 24 * 7,
};


const validations = {
  hash: Joi.string().alphanum().min(64).max(64).required(),
  lifetime: Joi.string().valid(...Object.keys(lifetimes)).required(),
};

const RedisClient = Redis.createClient({
  host: process.env.REDIS_HOST
});

RedisClient.get = promisify(RedisClient.get).bind(RedisClient);
RedisClient.set = promisify(RedisClient.set).bind(RedisClient);
RedisClient.del = promisify(RedisClient.del).bind(RedisClient);
RedisClient.exists = promisify(RedisClient.exists).bind(RedisClient);

const init = async () => {

  const server = Hapi.server({
    port: 9000,
    routes: {
      validate: {
        failAction: (request, h, err) => {
          throw err;
        }
      }
    }
  });

  // create
  server.route({
    method: 'POST',
    path: '/api/secret',
    handler: async (request, h) => {
      const {secret, lifetime} = request.payload;

      const expiry = lifetimes[lifetime];
      const hash = CryptoJS.SHA256(secret).toString();

      RedisClient.set(hash, secret, 'EX', expiry);

      return h.response({
        hash: hash,
        expiry: expiry,
      }).code(201)
    },
    options: {
      validate: {
        payload: Joi.object({
          secret: Joi.string().required(),
          lifetime: validations.lifetime,
        })
      }
    }
  });

  // exists
  server.route({
    method: 'GET',
    path: '/api/secret/{hash}/exists',
    handler: async (request, h) => {

      const {hash} = request.params;
      const exists = await RedisClient.exists(hash);

      if (!exists) {
        return h.response(null).code(404)
      }

      return h.response(null).code(204)
    },
    options: {
      validate: {
        params: Joi.object({
          hash: validations.hash,
        })
      }
    }
  });

  // reveal + delete
  server.route({
    method: ['GET'],
    path: '/api/secret/{hash}',
    handler: async (request, h) => {
      const {hash} = request.params;
      const secret = await RedisClient.get(hash);

      if (!secret) {
        return h.response(null).code(404)
      }

      RedisClient.del(hash);
      return h.response(secret);
    }
  });

  // reveal + delete
  server.route({
    method: ['DELETE'],
    path: '/api/secret/{hash}',
    handler: async (request, h) => {
      const {hash} = request.params;

      const exists = await RedisClient.exists(hash);

      if (!exists) {
        return h.response(null).code(404)
      }

      RedisClient.del(hash);
      return h.response(null).code(204);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

RedisClient.on("error", function (error) {
  console.error(error);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();