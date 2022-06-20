---
description: Deploy serverless in an instant with Vercel
---

# Deploy to Vercel

>The following instructions assume you have read the [General Deployment Setup](./introduction.md#general-deployment-setup) section above.

## Vercel tl;dr Deploy

If you simply want to experience the Vercel deployment process without a database and/or adding custom code, you can do the following:
1. create a new redwood project: `yarn create redwood-app ./vercel-deploy`
2. after your "vercel-deploy" project installation is complete, init git, commit, and add it as a new repo to GitHub, BitBucket, or GitLab
3. run the command `yarn rw setup deploy vercel` and commit and push changes
4. use the Vercel [Quick Start](https://vercel.com/#get-started) to deploy

_If you choose this quick deploy experience, the following steps do not apply._

## Redwood Project Setup

If you already have a Redwood project, proceed to the next step.

Otherwise, we recommend experiencing the full Redwood DX via the [Redwood Tutorial](tutorial/foreword.md). Simply return to these instructions when you reach the "Deployment" section.

## Redwood Deploy Configuration

Complete the following two steps. Then save, commit, and push your changes.

### Step 1. Serverless Functions Path

Run the following CLI Command:
```shell
yarn rw setup deploy vercel
```

This updates your `redwood.toml` file, setting `apiUrl = "/api"`:

### Step 2. Database Settings

Follow the steps in the [Prisma and Database](#3-prisma-and-database) section above. _(Skip this step if your project does not require a database.)_

### Vercel Initial Setup and Configuration
Either [login](https://vercel.com/login) to your Vercel account and select "Import Project" or use the Vercel [quick start](https://vercel.com/#get-started).

Then select the "Continue" button within the "From Git Repository" section:
<img src="https://user-images.githubusercontent.com/2951/90482970-e6f3e700-e0e8-11ea-8b3e-979745b0a226.png" />

Next, select the provider where your repo is hosted: GitHub, GitLab, or Bitbucket. You'll be asked to login and then provider the URL of the repository, e.g. for a GitHub repo `https://github.com/your-account/your-project.git`. Select "Continue".

You'll then need to provide permissions for Vercel to access the repo on your hosting provider.

### Import and Deploy your Project
Vercel will recognize your repo as a Redwood project and take care of most configuration heavy lifting. You should see the following options and, most importantly, the "Framework Preset" showing RedwoodJS.

<img src="https://user-images.githubusercontent.com/2951/90486275-9337cc80-e0ed-11ea-9af3-fd9613c1256b.png" />

Leave the **Build and Output Settings** at the default settings (unless you know what you're doing and have very specific needs).

In the "Environment Variables" dropdown, add `DATABASE_URL` and your app's database connection string as the value. (Or skip if not applicable.)

> When configuring a database, you'll want to append `?connection_limit=1` to the URI. This is [recommended by Prisma](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/deployment#recommended-connection-limit) when working with relational databases in a Serverless context. For production apps, you should setup [connection pooling](https://redwoodjs.com/docs/connection-pooling).

For example, a postgres connection string should look like `postgres://<user>:<pass>@<url>/<db>?connection_limit=1`

Finally, click the "Deploy" button. You'll hopefully see a build log without errors (warnings are fine) and end up on a screen that looks like this:

<img src="https://user-images.githubusercontent.com/2951/90487627-9469f900-e0ef-11ea-9378-9bb85e02a792.png" />

Go ahead, click that "Visit" button. You’ve earned it 🎉

## Vercel Dashboard Settings

From the Vercel Dashboard you can access the full settings and information for your Redwood App. The default settings seem to work just fine for most Redwood projects. Do take a look around, but be sure check out the [docs as well](https://vercel.com/docs).

From now on, each time you push code to your git repo, Vercel will automatically trigger a deploy of the new code. You can also manually redeploy if you select "Deployments", then the specific deployment from the list, and finally the "Redeploy" option from the vertical dots menu next to "Visit".
