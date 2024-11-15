import express from 'express'
import { configDotenv } from 'dotenv';
configDotenv()
const app =express()




//middleware
import { applyMiddleware } from './src/middleware/middleware.js';
import { logger } from "./src/middleware/logger.js";
import { globalLimiter, apiLimiter } from './src/middleware/rateLimiter.js';
applyMiddleware(app)
app.use(globalLimiter);
app.all('*', logger) 





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