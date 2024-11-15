import asyncHandler from "express-async-handler";
import { scrapeGitHubProfile,scrapeRepositories,get_readMeFile,repo_info ,get_rawFileUrls} from "../utils/scraper.js";

export const getProfile=asyncHandler(async(req,res)=>{
    const {user}=req.body

    if (!user){
        return res.status(400).json({
            status:400,
        })
    }

const profile=await scrapeGitHubProfile(user)

if (profile.status==400){
    return res.status(400).json(profile)
}

return res.status(200).json({
    status:200,
    profile:profile
})
})


export const getRepositories=asyncHandler(async(req,res)=>{
    const {user}=req.body

    if (!user){
        return res.status(400).json({
            status:400,
        })
    }
    const repositories=await scrapeRepositories(user)

    if (repositories.status==400){
        return res.status(400).json(repositories)
    }
    

    return res.status(200).json({
        status:200,
        repositories:repositories
    })
})


export const getProfileReadme=asyncHandler(async(req,res)=>{
    const {user}=req.body

    if (!user){
        return res.status(400).json({
            status:400,
        })
    }
    const profileReadme=await get_readMeFile(user,user)

    if (profileReadme.status==400){
        return res.status(400).json(profileReadme)
    }
    
    return res.status(200).json({
        status:200,
        profileReadme:String(profileReadme)
    })
})

export const getRepoDetails=asyncHandler(async(req,res)=>{
    const {user,repo}=req.body

    const {isproj}=req.query 

    const proj = isproj=='true'? true:false


    if (!user || !repo){
        return res.status(400).json({
            status:400,
        })
    }

    const repositoryInfo=await repo_info(user,repo,proj)

    if (repositoryInfo.status==400 || repositoryInfo.status==404){
        return res.status(400).json(repositoryInfo)
    }
    

    return res.status(200).json({
        status:200,
        repositoryInfo:repositoryInfo
    })
})

export const getRepositoriesDetail=asyncHandler(async(req,res)=>{
    const {user}=req.body
    const {isproj}=req.query 
    const proj = isproj=='true'? true:false

    if (!user){
        return res.status(400).json({
            status:400,
        })
    }

    const repositories=await scrapeRepositories(user)

    
    if (repositories.status==400 ){
        return res.status(400).json(repositoryInfo)
    }
 
    const repositoryInfo=await Promise.all(
        repositories.map(async (repo) => {
            return await repo_info(user,repo,proj)
        })
    )
    

    return res.status(200).json({
        status:200,
        projects:repositoryInfo.filter((item)=>typeof(item.status) !='number') //excluding all 404 or 400
    })
})

export const getRepoFileDetails=asyncHandler(async(req,res)=>{

// Eg: [{
//     name: 'lake.jfif',
//     path: 'Images/edits/lake.jfif',
//     url: 'https://raw.githubusercontent.com/DharambirAgrawal/PythonPractice/main/Images/edits/lake.jfif'
//   }]

    const data=await get_rawFileUrls("DharambirAgrawal","PythonPractice")
    console.log(data)
    res.status(200).json(data)
})

export const getRepoRawFiles=asyncHandler(async(req,res)=>{})

