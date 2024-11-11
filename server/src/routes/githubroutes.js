import express from "express";

import { getProfile,getProfileReadme,getProjects,getRepoDetails,getRepoFileDetails,getRepoRawFiles,getRepositories } from "../controller/githubcontroller.js";

const GithubRouter = express.Router();



export const githubRouter = GithubRouter
.post("/profile", getProfile)
.post("/repositories", getRepositories)
.post("/profilereadme", getProfileReadme)
.post("/projects", getProjects)
.post("/repoinfo", getRepoDetails)
.post("/reporawfiles", getRepoRawFiles)
.post("/repofiledetails", getRepoFileDetails)