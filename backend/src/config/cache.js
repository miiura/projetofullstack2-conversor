const { createClient } = require('redis');
const winston = require('winston');

let client;
const initCache = async (redisUrl) => {
  if (!redisUrl) {
    winston.warn('REDIS_URL não informado — usando cache em memória simples.');
    // fallback simples
    const memoryCache = new Map();
    return {
      get: async (k) => memoryCache.get(k),
      set: async (k, v, opts={}) => {
        if (opts.EX) {
          // ignorar TTL no fallback
        }
        memoryCache.set(k, v);
      },
      del: async (k) => memoryCache.delete(k)
    };
  }
  client = createClient({ url: redisUrl });
  client.on('error', (err) => winston.error('Redis Client Error', err));
  await client.connect();
  winston.info('Redis conectado');
  return {
    get: async (k) => {
      const val = await client.get(k);
      return val;
    },
    set: async (k, v, opts={EX: 3600}) => {
      if (opts && opts.EX) {
        await client.set(k, v, { EX: opts.EX });
      } else {
        await client.set(k, v);
      }
    },
    del: async (k) => await client.del(k),
    client
  };
};

module.exports = initCache;
