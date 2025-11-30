// Simple in-memory cache using node-cache. For production, troque por Redis.
const NodeCache = require('node-cache');
const ttl = process.env.CACHE_TTL_SECONDS ? Number(process.env.CACHE_TTL_SECONDS) : 60;
const cache = new NodeCache({ stdTTL: ttl });


module.exports = cache;