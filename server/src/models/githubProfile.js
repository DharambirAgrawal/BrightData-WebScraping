import mongoose from "mongoose";

const githubProfile = mongoose.Schema(
  {
    username: { type: String, required: [true, "Please enter the Username"], unique: true,
        trim: true },
    email: String,
    name:String,
    bio:String,
    followers:String,
    following:String,
    repositories:String,
    location:String,
    social:{type:Array},
    website:{type:Array},
    profilePictureUrl:String,
    repositories:{type:Array}
  
  },
  { timestamps: true }
);


export const GithubProfile = mongoose.model("GithubProfile", githubProfile);