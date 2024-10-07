import express from 'express'
import { configDotenv } from 'dotenv';
configDotenv()

import axios from 'axios';

const app =express()

const cheerio = await import('cheerio');

import { applyMiddleware } from './src/middleware/middleware.js';

applyMiddleware()


import { get_readMeFile,scrapeGitHubProfile,scrapeRepositories,testing ,get_repo_info} from './src/utils/scraper.js';
scrapeGitHubProfile()
// scrapeRepositories('DharambirAgrawal')
// testing()
// get_repo_info('DharambirAgrawal')
// get_readMeFile()

// // Define the URL of your GitHub profile
// const GITHUB_URL = 'https://github.com/DharambirAgrawal'; 
// const GITHUB_URL2 = 'https://github.com/DharambirAgrawal?tab=repositories'; 


// // Function to scrape the profile
// async function scrapeGitHubProfile() {
//   try {
//     // Make a request to fetch the HTML content of your GitHub profile
//     const { data } = await axios.get(GITHUB_URL);

//     // Load the HTML into cheerio
//     const $ = cheerio.load(data);

//     // Extract specific data (Name, followers, repository count, etc.)
//     const name = $('span.p-name.vcard-fullname').text().trim();
//     const username = $('span.p-nickname.vcard-username').text().trim();
//     const bio = $('div.p-note.user-profile-bio').text().trim();
//     const followers = $('a[href$="followers"] .text-bold').text().trim();
//     const following = $('a[href$="following"] .text-bold').text().trim();
//     const repositories = $('span.Counter').first().text().trim();

//     // const repos=$('h3.wb-break-all')
//     // const repos = $('h3.wb-break-all').map(function() {
//     //     return $(this).text().trim();
//     // }).get();
//     // console.log(repos)
//     const link = $('a[href="/DharambirAgrawal/Hackaton"][itemprop="name codeRepository"]');


//     console.log('GitHub Profile Details:');
//     console.log(`Name: ${name}`);
//     console.log(`Username: ${username}`);
//     console.log(`Bio: ${bio}`);
//     console.log(`Followers: ${followers}`);
//     console.log(`Following: ${following}`);
//     console.log(`Public Repositories: ${repositories}`);
//     const readmeContent = $('div.Box.profile-readme').html(); // Example: Select the README container

//     // Output the README content in HTML
//     // console.log(readmeContent);
//   } catch (error) {
//     console.error('Error fetching GitHub profile:', error);
//   }
// }

// async function scrapeGitHubProfile2() {
//     try {
//       // Make a request to fetch the HTML content of your GitHub profile
//       const { data } = await axios.get(GITHUB_URL2);
  
//       // Load the HTML into cheerio
//       const $ = cheerio.load(data);
    
   
//     const repos = $('h3.wb-break-all [itemprop="name codeRepository"]').map(function() {
//         return $(this).text().trim();
//     }).get();
    
// console.log(repos)
    
  
     
//     } catch (error) {
//       console.error('Error fetching GitHub profile:', error);
//     }
// }

// // Call the function
// scrapeGitHubProfile();
// scrapeGitHubProfile2();

// const repo = 'DharambirAgrawal/DharambirAgrawal';  // Replace with the actual repo
// const url = `https://raw.githubusercontent.com/DharambirAgrawal/DharambirAgrawal/main/README.md`;  // Adjust if the file is named README.mdx

// // // Fetch the raw content
// axios.get(url, {
//   headers: {
//     'Accept': 'application/vnd.github.v3.raw',  // Ensure raw content is fetched
//   }
// })
//   .then(response => {
//     const readmeMDX = response.data;
//     // Output the raw MDX content
//     console.log(readmeMDX);
//   })
//   .catch(error => {
//     console.error('Error fetching the README:', error);
//   });

// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents/README.md
// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents
// https://api.github.com/repos/DharambirAgrawal/integreat/contents

app.listen(process.env.PORT,()=>{
  console.log(`http://localhost:${process.env.PORT}`)
})