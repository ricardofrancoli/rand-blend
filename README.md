# Spotify Genre Blender

## Project Overview

Spotify Genre Blender is an application that leverages the [Spotify API](https://developer.spotify.com/documentation/web-api) to analyse your most listened genres across different time ranges (short, medium, or long term). Users can select their favorite genres and generate a new Spotify playlist that blends these genres, creating a unique listening experience

## Tech Stack

This project is built using a modern web development stack:

- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Turborepo](https://turbo.build/) - High-performance build system for JavaScript and TypeScript codebases
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework for building user interfaces
- [ts-rest](https://ts-rest.com/) - TypeScript-first RPC-like Client

## Prerequisites

- Node.js (v20.10.0 or later)
- pnpm (latest version)

## Set Up

Follow these steps to set up the project locally:

1. Clone the repository

```zsh
git clone https://github.com/ricardofrancoli/rand-blend.git
cd spotify-genre-blender
```

2. Install dependencies

```zsh
pnpm install
```

3. Set up environment files

- In `apps/api`, create a `.env` file
- In `apps/web`, create `.env.local` and `.env.production.local` files
- Contact the project maintainer for the necessary secrets and environment variables

4. Start the development server

```zsh
pnpm run dev
```

This command initialises the monorepo's apps and packages in development mode. Changes will be watched and hot-reloaded.
