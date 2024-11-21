import mongoose from "mongoose";

const githubProfile = mongoose.Schema(
  {
    userName: { type: String, required: [true, "Please enter the Username"] },
    email: String,
    name:String,
    bio:String,
    followers:String,
    following:String,
    repositories:String,
    location:String,
    social:String,
    website:String,
    profilePictureUrl:String,
  
  },
  { timestamps: true }
);


export const User = mongoose.model("GithubProfile", githubProfile);