// Define the URL of your GitHub profile
import axios from "axios";
const cheerio = await import('cheerio');



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


        console.log('GitHub Profile Details:');
        console.log(`Name: ${name}`);
        console.log(`Username: ${username}`);
        console.log(`Bio: ${bio}`);
        console.log(`Followers: ${followers}`);
        console.log(`Following: ${following}`);
        console.log(`Public Repositories: ${repositories}`);
        console.log('location: ', location)
        console.log('social: ', social)
        console.log('website: ', website)


    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
    }
}



export async function scrapeRepositories() {
    const GITHUB_URL2 = 'https://github.com/DharambirAgrawal?tab=repositories';

    try {
        // Make a request to fetch the HTML content of your GitHub profile
        const { data } = await axios.get(GITHUB_URL2);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);


        const repos = $('h3.wb-break-all [itemprop="name codeRepository"]').map(function () {
            return $(this).text().trim();
        }).get();

        console.log("Number of Repositories: ", repos.length)
        
        console.log("Repositories: ", repos)




    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
    }
}

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


