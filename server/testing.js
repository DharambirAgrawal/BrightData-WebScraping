import express from 'express'
import { configDotenv } from 'dotenv';
configDotenv()

import axios from 'axios';

const app =express()


import { applyMiddleware } from './src/middleware/middleware.js';

applyMiddleware()


import { get_readMeFile,scrapeGitHubProfile,scrapeRepositories,testing ,get_repo_info} from './src/utils/scraper.js';
// scrapeGitHubProfile("DharambirAgrawal").then((info)=>{
//   console.log(info)
// })
// scrapeRepositories('DharambirAgrawal')
// testing("DharambirAgrawal","Python_Primer_Chapter1").then((info)=>{
//   console.log(info)
// })
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




// Define the URL of your GitHub profile
import axios from "axios";
const cheerio = await import('cheerio');
import { url_combiner } from "./utils.js";

// const base_raw_url='https://raw.githubusercontent.com/*USER_NAME*/*REPO*'
// const base_api_url='https://api.github.com/repos/*USER_NAME*/*REPO*'
const base_github_url = 'https://github.com'
const base_raw_url = 'https://raw.githubusercontent.com'
const base_api_url = 'https://api.github.com'

// #done
export async function scrapeRepositories(user) {

    const link = `/${user}?tab=repositories`;

    const URL = url_combiner(base_github_url, link)

    try {
        // Make a request to fetch the HTML content of your GitHub profile
        const { data } = await axios.get(URL);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);


        const repos = $('h3.wb-break-all [itemprop="name codeRepository"]').map(function () {
            return $(this).text().trim();
        }).get();

        // console.log("Number of Repositories: ", repos.length)

        // console.log("Repositories: ", repos)
        return repos




    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
    }
}

// #done
export const get_readMeFile = (user, repos) => {

    const url = `${base_raw_url}/${user}/${repos}/main/README.md`;  // Adjust if the file is named README.mdx

    // Fetch the raw content
    axios.get(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',  // Ensure raw content is fetched
        }
    })
        .then(response => {
            const readmeMDX = response.data;
            // Output the raw MDX content
            console.log(readmeMDX);
        })
        .catch(error => {
            console.error('Error fetching the README:', error);
        });
}

// #done
export async function scrapeGitHubProfile(user) {
    const GITHUB_URL = `https://github.com/${user}`;

    try {
        // Make a request to fetch the HTML content of your GitHub profile
        const { data } = await axios.get(GITHUB_URL);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Extract specific data (Name, followers, repository count, etc.)
        const name = $('span.p-name.vcard-fullname').text().trim();
        const username = $('span.p-nickname.vcard-username').text().trim();
        const bio = $('div.p-note.user-profile-bio').text().trim();
        const followers = $('a[href$="followers"] .text-bold').text().trim();
        const following = $('a[href$="following"] .text-bold').text().trim();
        const repositories = $('span.Counter').first().text().trim();
        const location = $('li[itemprop$="homeLocation"]').text().trim()
        const social = $('li[itemprop$="social"] a').map(function () {
            return $(this).text().trim();
        }).get();
        const website = $('li[data-test-selector$="profile-website-url"] a').map(function () {
            return $(this).text().trim();
        }).get();

        const profilePictureUrl = $('img.avatar').attr('src'); // Select the avatar image


        return {
            name,
            username,
            bio,
            followers,
            following,
            repositories,
            location,
            social,
            website,
            profilePictureUrl
        }


    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
    }
}

//done

export const repo_info = async (user, repo, onlyProject = false) => {
    const link = `/repos/${user}/${repo}`;
    const URL = url_combiner(base_api_url, link);

    try {
        // Wait for the axios request to complete
        const response = await axios.get(URL, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
            }
        });

        const repoInfo = response.data;

        // print(repoInfo)
        await new Promise(r => setTimeout(r, 2000));
        // Return the desired repo information
        const data = {
            name: repoInfo.name,
            branch: repoInfo.default_branch,
            topic: repoInfo.topics,
            clone_url: repoInfo.clone_url,
            updated_at: repoInfo.updated_at,
            pushed_at: repoInfo.pushed_at,
            created_at: repoInfo.created_at,
            description: repoInfo.description,
        };
        if (!onlyProject) {
            return data
        }

        if (data.topic.includes('project')) {
            return data
        } else {
            return null
        }


    } catch (error) {
        // console.error(`Error fetching repository data for :`, error.response.data.message);
        console.error(`Error fetching repository data for :`, error);

        return null; // Handle error and return null for failed requests
    }
}

//done
// start -->
async function filter_dir(repoInfo, fileUrl = null) {
    // let fileUrl=[]
    if (fileUrl == null) {
        fileUrl = []
    }

    await Promise.all(
        repoInfo.map(async (items) => {
            if (items.type == 'file') {
                fileUrl.push({
                    name: items.name,
                    path: items.path,
                    url: items.download_url
                })
            }
            else if (items.type == 'dir') {
                const URL = items.url
                const response = await axios.get(URL, {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
                    }
                });
                const repoInfo_new = response.data;
                return await filter_dir(repoInfo_new, fileUrl)
            }
        })

    )

    return fileUrl
}

export const get_rawFileUrls = async (user, repo) => {

    const URL = `https://api.github.com/repos/${user}/${repo}/contents`

    try {
        // Wait for the axios request to complete
        const response = await axios.get(URL, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
            }
        });

        const repoInfo = response.data;


        const rawFileUrls = await filter_dir(repoInfo)
        return rawFileUrls


    } catch (err) {
        console.log(err)
    }


}
// <-- end

//done
export const get_repo_rawFiles = async (user, repo) => {

    try {

        const raw_file_list = await get_rawFileUrls(user, repo)
        const data = await Promise.all(
            raw_file_list.map(async (items) => {


                const response = await axios.get(items.url, {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
                    }
                });

                const rawFile = response.data;

                return {
                    filename: items.name,
                    path: items.path,
                    raw: rawFile
                }


            })

        )
        return data
    } catch (err) {
        console.log(err)
    }

}


//not much important
export async function get_repo_info(user, onlyProject = true) {
    try {
        const repos = await scrapeRepositories(user); // Assuming scrapeRepositories is an async function

        // Use map to create an array of promises, then await them all
        const infos = await Promise.all(
            repos.map(async (repository, index) => {
                const link = `/repos/${user}/${repository}`;
                const URL = url_combiner(base_api_url, link);
                try {
                    // Wait for the axios request to complete
                    const response = await axios.get(URL, {
                        headers: {
                            'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
                        }
                    });

                    const repoInfo = response.data;

                    // print(repoInfo)
                    await new Promise(r => setTimeout(r, 2000));
                    // Return the desired repo information

                    const data = {
                        id: index,
                        name: repoInfo.name,
                        branch: repoInfo.default_branch,
                        topic: repoInfo.topics,
                        clone_url: repoInfo.clone_url,
                        updated_at: repoInfo.updated_at,
                        pushed_at: repoInfo.pushed_at,
                        created_at: repoInfo.created_at,
                        description: repoInfo.description,
                    };
                    if (!onlyProject) {
                        return data
                    }

                    if (data.topic.includes('project')) {
                        return data
                    } else {
                        return null
                    }

                } catch (error) {
                    console.error(`Error fetching repository data for :`, error.response.data.message);
                    return null; // Handle error and return null for failed requests
                }
            })
        );

        return infos.filter(info => info !== null); // Filter out null results (if any)
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
    }
}




export const testing = async (user, repo) => {
    try {
        // const raw_file_list = await get_rawFileUrls(user, repo)
        // console.log(raw_file_list)
                const response = await axios.get("https://raw.githubusercontent.com/DharambirAgrawal/Python_Primer_Chapter1/main/notebooks/CH_1_Creativity.ipynb", {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
                    }
                });

                const rawFile = response.data;

                console.log(rawFile.cells)

              
    } catch (err) {
        console.log(err)
    }

}

//example response from ipynb file

// "cells": [
//     {
//      "cell_type": "markdown",
//      "metadata": {},
//      "source": [
//       "1. Write a paeudo-code description of a function that reverses a list of n integers, so that the numbers are listed in the opposite order than they were before,and compare this method to an equivalent Python function for doing the same thing. "
//      ]
//     },
//     {
//      "cell_type": "code",
//      "execution_count": 14,
//      "metadata": {},
//      "outputs": [
//       {
//        "name": "stdout",
//        "output_type": "stream",
//        "text": [
//         "[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]\n",
//         "[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]\n"
//        ]
//       }
//      ],
//      "source": [
//       "# \n",
//       "# start\n",
//       "# go to end of the list\n",
//       "# create a new list with the elements in reverse order\n",
//       "# stop\n",
//       "# \n",
//       "def swap_list_1(lists):\n",
//       "    return lists[::-1]\n",
//       "\n",
//       "def swap_list(lists):\n",
//       "    return [lists[-i] for i in range(1,len(lists)+1)]\n",
//       "\n",
//       "print(swap_list_1([1,2,3,4,5,6,7,8,9,10]))\n",
//       "print(swap_list([1,2,3,4,5,6,7,8,9,10]))"
//      ]
//     }
//   ]


// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents/README.md
// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents
// https://api.github.com/repos/DharambirAgrawal/integreat/contents



// # for extracing the details to get the codes

// https://raw.githubusercontent.com/DharambirAgrawal/repo_name/main/file_name
// EG: https://raw.githubusercontent.com/DharambirAgrawal/Hackaton/main/client/README.md

