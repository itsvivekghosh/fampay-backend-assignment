require("dotenv").config();
const { createClient } = require("redis");


const redisPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;


export const redisClient = createClient({
        socket: {
            host: redisHost,
            port: redisPort,
        }
    }
);