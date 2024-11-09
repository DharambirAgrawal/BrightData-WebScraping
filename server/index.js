import express from 'express'
import { configDotenv } from 'dotenv';
configDotenv()

import axios from 'axios';

const app =express()

const cheerio = await import('cheerio');

import { applyMiddleware } from './src/middleware/middleware.js';

applyMiddleware()


import { get_readMeFile,scrapeGitHubProfile,scrapeRepositories,testing ,get_repo_info} from './src/utils/scraper.js';
// scrapeGitHubProfile("DharambirAgrawal").then((info)=>{
//   console.log(info)
// })
// scrapeRepositories('DharambirAgrawal')
testing("DharambirAgrawal","Python_Primer_Chapter1").then((info)=>{
  console.log(info)
})
// get_repo_info('DharambirAgrawal')
// get_repo_info('DharambirAgrawal').then((infos) => {
//   console.log(infos);
// });
// get_readMeFile("DharambirAgrawal","hackaton")


//controller testing
// import { get_readMeFile,get_rawFileUrls,repo_info,scrapeGitHubProfile,scrapeRepositories,get_repo_rawFiles } from './src/controller/githubcontroller.js';

// const repos=await scrapeRepositories("DharambirAgrawal")
// console.log(repos)

// const repos=await get_readMeFile("DharambirAgrawal","DharambirAgrawal")
// console.log(repos)

// const repos=await scrapeGitHubProfile("DharambirAgrawal")
// console.log(repos)

// const repos=await repo_info("DharambirAgrawal", "DharambirAgrawal")
// console.log(repos)

// const repos=await get_rawFileUrls("DharambirAgrawal", "Python_Primer_Chapter1")
// console.log(repos)

// const repos=await get_repo_rawFiles("DharambirAgrawal","Python_Primer_Chapter1")
// console.log(repos)
// console.log(repos.length)


app.listen(process.env.PORT,()=>{
  console.log(`http://localhost:${process.env.PORT}`)
})