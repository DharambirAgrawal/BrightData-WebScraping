import { BASE_GITHUB_API_URL, BASE_GITHUB_URL, BASE_GITHUB_RAW_URL } from "./constants.js";
import { url_combiner, filter_dir } from "./utils.js";
import axios from "axios";
const cheerio = await import('cheerio');

export async function scrapeRepositories(user) {

    const link = `/${user}?tab=repositories`;

    const URL = url_combiner(BASE_GITHUB_URL, link)

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
        return {
            status: 400,
            message: error.message
        }
    }
}

export const get_readMeFile = async (user, repos) => {

    const url = `${BASE_GITHUB_RAW_URL}/${user}/${repos}/main/README.md`;  // Adjust if the file is named README.mdx

    try {

        const res = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',  // Ensure raw content is fetched
            }
        })
        const readmeMDX = res.data
        return readmeMDX
    } catch (err) {
        return {
            status: 400,
            message: err.message
        }
    }
}

export async function scrapeGitHubProfile(user) {
    const GITHUB_URL = `${BASE_GITHUB_URL}/${user}`;

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
            profilePictureUrl,
        }


    } catch (error) {
        return {
            status: 400,
            message: error.message
        }
    }
}

export const repo_info = async (user, repo, onlyProject = false) => {
    const link = `/repos/${user}/${repo}`;
    const URL = url_combiner(BASE_GITHUB_API_URL, link);

    try {
        // Wait for the axios request to complete
        const response = await axios.get(URL, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
            }
        });

        const repoInfo = response.data;

        // print(repoInfo)
        // await new Promise(r => setTimeout(r, 2000));
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
            return {
                status: 404,
                message: "No project found"
            }
        }


    } catch (error) {

        return {
            status: 400,
            message: error.message
        }

    }
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
        return {
            status: 400,
            message: err.message
        }
    }
}

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
        return {
            status: 400,
            message: err.message
        }
    }

}


export const get_rawFile = async (user, repo, path) => {
    const URL = `${BASE_GITHUB_RAW_URL}/${user}/${repo}/main/${path}`
    try {
        const response = await axios.get(URL);
        const rawFile=await response.data

        const filename = path.split('/')
        return {
            filename:filename[filename.length-1],
            path: path,
            raw: rawFile
        }
    } catch (err) {

        return {
            status: err.status || 400,
            message: err.message
        }
    }

}

