![Language](https://img.shields.io/badge/language-JavaScript-f7df1e)

# BrightData-WebScraping

A full-stack web scraping toolkit: an Express + MongoDB API that scrapes GitHub profiles and repositories, paired with a Next.js frontend for a proxy-backed scraper built on Bright Data.

## What's in here

The project has two independent parts that share a "scrape the web, structure the result" theme:

- **`server/`**: a working Express API that scrapes public GitHub profile pages and the GitHub REST API to pull structured profile, repository, README, and file data, and persists it to MongoDB.
- **`client/`**: a Next.js app built around a scraper module for Amazon product pages, routed through Bright Data's residential proxy network. The UI has a source picker for Amazon, Google, and SkyScanner, but it's a work in progress: the form validation isn't finished, so submitting it doesn't yet trigger the scraper.

## Features

**Server (GitHub scraper)**
- Scrapes a GitHub user's public profile (name, bio, followers/following, location, social links, avatar) with Cheerio
- Lists a user's repositories and fetches per-repo metadata (branch, topics, description, timestamps) via the GitHub REST API
- Fetches a repo's `README.md` and recursively walks a repository's file tree to collect raw file contents
- Persists scraped profiles and repository details to MongoDB (Mongoose)
- Tiered rate limiting (`express-rate-limit`) with an optional Redis-backed store for distributed limits, plus a lightweight request logger

**Client (Bright Data scraper)**
- Scrapes Amazon product pages (title, images, price, discount, bullet points) through Bright Data's rotating residential proxy, using a fresh session ID per request

## Tech Stack

- **Backend:** Node.js, Express, Mongoose (MongoDB), Cheerio, Axios, ioredis, express-rate-limit
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Cheerio, Axios
- **Scraping/Proxy:** Bright Data residential proxy (client), GitHub REST API + HTML scraping (server)

## Getting Started

### Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url        # optional, falls back to in-memory rate limiting if unset
```

```bash
npm start
```

The API listens on `http://localhost:<PORT>`.

### Client

```bash
cd client
npm install
```

Create a `.env.local` file in `client/` with your Bright Data credentials (from the Bright Data dashboard):

```
BRIGHT_DATA_USERNAME=
BRIGHT_DATA_PASSWORD=
```

```bash
npm run dev
```

Open `http://localhost:3000`.

## Usage

Once the server is running, the GitHub scraper is available over REST under `/api/github`:

| Method | Route                             | Description                                           |
|--------|------------------------------------|--------------------------------------------------------|
| POST   | `/api/github/profile`             | Scrape and store a user's profile                     |
| POST   | `/api/github/repositories`        | List a user's repository names                        |
| POST   | `/api/github/profilereadme`       | Fetch a user's profile README                         |
| POST   | `/api/github/repoinfo`            | Get metadata for one repository                       |
| POST   | `/api/github/repositoriesdetail`  | Get metadata for all of a user's repositories          |
| POST   | `/api/github/repofiledetails`     | List a repository's files                             |
| POST   | `/api/github/reporawfiles`        | Fetch the raw contents of every file in a repository  |
| POST   | `/api/github/reporawfile`         | Fetch the raw contents of a single file (by path)      |

All routes take a JSON body such as `{ "user": "octocat", "repo": "Hello-World" }`. Requests are rate-limited globally and per-API-route.

## How it works

The server doesn't rely on a proxy or third-party scraping API for GitHub. It parses GitHub's public profile HTML with Cheerio for data that isn't exposed via the REST API (like follower/following counts and the profile bio), and falls back to the official GitHub REST API for repository metadata and file contents. File scraping walks a repo's directory tree recursively, following each subdirectory returned by the `contents` API until every file's raw download URL has been collected.

The client's Amazon scraper takes the opposite approach. Since Amazon actively blocks scrapers, each request is routed through Bright Data's residential proxy with a randomized session ID per request, then parsed with Cheerio once the page loads.
