
const express = require('express')
const mongoose = require('mongoose');

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

//// redis
const session = require("express-session")
const RedisStore = require("connect-redis")(session)
const redis = require("redis")

const redisClient = redis.createClient({
  legacyMode: true,
  socket: {
    port: REDIS_PORT,
    host: REDIS_URL
  }
})

redisClient.connect()
  .then((a) => console.log('success to redeis'))
  .catch(console.error)


const postRouter = require('./router/postRoutes');
const userRouter = require('./router/userRoutes')

const app = express()
const port = process.env.PORT || 4000

const mongoConnectionString = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`;
const authObj = { auth: { username: 'mongoadmin', password: 'password_1234_mongo' } };

const connect = mongoose.connect(mongoConnectionString, authObj)
  .then(() => {
    console.log('connected to DB success fully')
    init();
  })
  .catch((e) => console.log(e));    

const init = (() => {

  app.use(express.json());
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000
    }
  })

  )
  app.use("/api/v1/posts", postRouter);
  app.use("/api/v1/users", userRouter);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

})
