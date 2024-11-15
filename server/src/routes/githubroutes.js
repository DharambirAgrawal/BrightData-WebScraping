import express from "express";

import { getProfile,getProfileReadme,getRepositoriesDetail,getRepoDetails,getRepoFileDetails,getRepoRawFiles,getRepositories } from "../controller/githubcontroller.js";

const GithubRouter = express.Router();



export const githubRouter = GithubRouter
.post("/profile", getProfile)
.post("/repositories", getRepositories)
.post("/profilereadme", getProfileReadme)
.post("/repoinfo", getRepoDetails)
.post("/repositoriesdetail", getRepositoriesDetail)
.post("/repofiledetails", getRepoFileDetails)
.post("/reporawfiles", getRepoRawFiles)