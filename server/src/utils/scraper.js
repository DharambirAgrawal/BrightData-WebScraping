// Define the URL of your GitHub profile
import axios from "axios";
const cheerio = await import('cheerio');
import { url_combiner } from "./utils.js";

// const base_raw_url='https://raw.githubusercontent.com/*USER_NAME*/*REPO*'
// const base_api_url='https://api.github.com/repos/*USER_NAME*/*REPO*'
const base_github_url='https://github.com'
const base_raw_url='https://raw.githubusercontent.com'
const base_api_url='https://api.github.com'

export async function scrapeRepositories(user) {

    const link = `/${user}?tab=repositories`;

    const URL=url_combiner(base_github_url,link)

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

export const get_readMeFile = () => {

    const url = `https://raw.githubusercontent.com/DharambirAgrawal/DharambirAgrawal/main/README.md`;  // Adjust if the file is named README.mdx

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

export async function scrapeGitHubProfile() {
    const GITHUB_URL = 'https://github.com/DharambirAgrawal';

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

export async function get_repo_info(user){
 

        try {
            const repos = await scrapeRepositories(user); // Assuming scrapeRepositories is an async function
    
            // Use map to create an array of promises, then await them all
            const infos = await Promise.all(
                repos.map(async (repository) => {
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
    
                        // Return the desired repo information
                        return {
                            name: repoInfo.name,
                            branch: repoInfo.default_branch,
                            topic: repoInfo.topics,
                            clone_url: repoInfo.clone_url,
                            updated_at: repoInfo.updated_at,
                            pushed_at: repoInfo.pushed_at,
                            created_at: repoInfo.created_at,
                            description: repoInfo.description,
                        };
                    } catch (error) {
                        console.error(`Error fetching repository data for ${repository}:`, error);
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
    
    // Example usage:
   
    
   




export const testing = () => {

    const url = `https://raw.githubusercontent.com/DharambirAgrawal/DharambirAgrawal/main/README.md`;  // Adjust if the file is named README.mdx

    // Fetch the raw content
    axios.get(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',  // Ensure raw content is fetched
        }
    })
        .then(response => {
            const readmeMDX = response.data;
            // Output the raw MDX content
            // console.log(readmeMDX);
        })
        .catch(error => {
            console.error('Error fetching the README:', error);
        });
}


// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents/README.md
// https://api.github.com/repos/DharambirAgrawal/DharambirAgrawal/contents
// https://api.github.com/repos/DharambirAgrawal/integreat/contents



// # for extracing the details to get the codes

// https://raw.githubusercontent.com/DharambirAgrawal/repo_name/main/file_name
// EG: https://raw.githubusercontent.com/DharambirAgrawal/Hackaton/main/client/README.md


