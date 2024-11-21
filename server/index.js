import express from 'express'
import { configDotenv } from 'dotenv';
configDotenv()
const app =express()

import { connectDB } from "./src/config/db.js";
connectDB();



//middleware
import { applyMiddleware } from './src/middleware/middleware.js';
import { logger } from "./src/middleware/logger.js";
import { globalLimiter, apiLimiter } from './src/middleware/rateLimiter.js';
applyMiddleware(app)
app.use(globalLimiter);
app.all('*', logger) 


// protect api using api key
import { v4 as uuidv4 } from 'uuid';
const apiKey = uuidv4();

app.all('*',async function(req,res,next){
  // const apiKey = req.header('x-api-key'); // Get API key from headers

  // if (!apiKey) {
  //   return res.status(401).send('API key is missing');
  // }
  if (apiKey==apiKey){
    next()
  }
  // next()
  res.status(400).json({
    status:400,
    message:"The api key is expired"
  })
})




//routes
import { githubRouter } from './src/routes/githubroutes.js';

app.use("/api", apiLimiter);
app.use("/api/github", githubRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "404 :(",
  });
});



app.listen(process.env.PORT,()=>{
  console.log("SERVER IS LISTENING...");
  console.log(`http://localhost:${process.env.PORT}`)
})