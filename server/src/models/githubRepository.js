import mongoose from "mongoose";

const githubRepoDetail = mongoose.Schema(
  {
    username: { type: String, required: [true, "Please enter the Username"], unique: true,
        trim: true },
        repos:[
            {
                name: { type: String, required: [true, "Please enter the name"], unique: true,
                    },
                branch: String,
                topic: Array,
                clone_url: String,
                updated_at: String,
                pushed_at: String,
                created_at: String,
                description: mongoose.Schema.Types.Mixed,
                files:[
                        {
                            name: String,
                            path: String,
                            url: String
                        }
                    ]
                
            },
        ]
    }
    );


export const GithubRepoDetail = mongoose.model("GithubRepository", githubRepoDetail);