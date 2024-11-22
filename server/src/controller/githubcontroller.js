import asyncHandler from "express-async-handler";
import { scrapeGitHubProfile, scrapeRepositories, get_readMeFile, repo_info, get_rawFileUrls, get_rawFile ,get_repo_rawFiles} from "../utils/scraper.js";
import { GithubProfile } from "../models/githubProfile.js";


//added the features of adding to db but needed to check if user exists and not exists then first create it and update and if exists update the old data

// get the detail of profile of repository
export const getProfile = asyncHandler(async (req, res) => {
    const { user } = req.body

    if (!user) {
        return res.status(400).json({
            status: 400,
        })
    }

    const profile = await scrapeGitHubProfile(user)

    if (profile.status == 400) {
        return res.status(400).json(profile)
    }

//add to databale
const githubProfile=await GithubProfile.create(profile)

if(!githubProfile){
    return res.status(500).json({
        status:500,
        message:"Somerthing went wrong!"
    })
}



    return res.status(200).json({
        status: 200,
        profile: profile
    })
})

// get the name of all repositories of user 
export const getRepositories = asyncHandler(async (req, res) => {
    const { user } = req.body

    if (!user) {
        return res.status(400).json({
            status: 400,
        })
    }
    const repositories = await scrapeRepositories(user)

    if (repositories.status == 400) {
        return res.status(400).json(repositories)
    }
    //saving to DB
    console.log(repositories)
    const githubProfile = await GithubProfile.findOneAndUpdate({username:user},{repository:repositories})

    console.log(githubProfile)
    return res.status(200).json({
        status: 200,
        repositories: repositories
    })
})

// get the readme of the profile
export const getProfileReadme = asyncHandler(async (req, res) => {
    const { user } = req.body

    if (!user) {
        return res.status(400).json({
            status: 400,
        })
    }
    const profileReadme = await get_readMeFile(user, user)

    if (profileReadme.status == 400) {
        return res.status(400).json(profileReadme)
    }

     //saving to DB
     const githubReadme = await GithubProfile.findOneAndUpdate({username:user},{readme:String(profileReadme)})
 

    return res.status(200).json({
        status: 200,
        profileReadme: String(profileReadme)
    })
})


// detail of one repository 
export const getRepoDetails = asyncHandler(async (req, res) => {
    const { user, repo } = req.body

    const { isproj } = req.query

    const proj = isproj == 'true' ? true : false


    if (!user || !repo) {
        return res.status(400).json({
            status: 400,
        })
    }

    const repositoryInfo = await repo_info(user, repo, proj)

    if (repositoryInfo.status == 400 || repositoryInfo.status == 404) {
        return res.status(400).json(repositoryInfo)
    }

    console.log(repositoryInfo)


    return res.status(200).json({
        status: 200,
        repositoryInfo: repositoryInfo
    })
})

// detail of all the repositories and also checking if project or not
export const getRepositoriesDetail = asyncHandler(async (req, res) => {
    const { user } = req.body
    const { isproj } = req.query
    const proj = isproj == 'true' ? true : false

    if (!user) {
        return res.status(400).json({
            status: 400,
        })
    }

    const repositories = await scrapeRepositories(user)


    if (repositories.status == 400) {
        return res.status(400).json(repositoryInfo)
    }

    const repositoryInfo = await Promise.all(
        repositories.map(async (repo) => {
            return await repo_info(user, repo, proj)
        })
    )

    console.log(repositoryInfo)


    return res.status(200).json({
        status: 200,
        projects: repositoryInfo.filter((item) => typeof (item.status) != 'number') //excluding all 404 or 400
    })
})

// get all the file details of the repository 
export const getRepoFileDetails = asyncHandler(async (req, res) => {

    // Eg: [{
    //     name: 'lake.jfif',
    //     path: 'Images/edits/lake.jfif',
    //     url: 'https://raw.githubusercontent.com/DharambirAgrawal/PythonPractice/main/Images/edits/lake.jfif'
    //   }]
    const { user, repo } = req.body


    if (!user || !repo) {
        return res.status(400).json({
            status: 400,
        })
    }
    const data = await get_rawFileUrls(user, repo)
    if (data.status == 400) {
        return res.status(400).json(repositoryInfo)
    }


    const fileDetail = data.map((item) => {
        return {
            name: item.name,
            path: item.path
        }
    })

    res.status(200).json({
        status: 200,
        fileDetail
    })
})

// just to get one raw file
export const getRepoRawFiles = asyncHandler(async (req, res) => {

    const { user, repo} = req.body


    if (!user || !repo) {
        return res.status(400).json({
            status: 400,
        })
    }
    const rawFiles = await get_repo_rawFiles(user, repo)
    if (rawFiles.status == 400 || rawFiles.status == 404) {
        return res.status(rawFiles.status).json(rawFiles)
    }

    console.log(rawFiles)
    res.status(200).json({
        status: 200,
        data:rawFiles
    })
})

// get all the raw file of the repository
export const getRepoRawFile = asyncHandler(async (req, res) => {

    const { user, repo, path } = req.body


    if (!user || !repo || !path) {
        return res.status(400).json({
            status: 400,
        })
    }
    const rawFile = await get_rawFile(user, repo, path)
    if (rawFile.status == 400 || rawFile.status == 404) {
        return res.status(rawFile.status).json(rawFile)
    }

    console.log(rawFile)
    res.status(200).json({
        status: 200,
        data:rawFile
    })
})

