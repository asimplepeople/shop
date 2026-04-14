---
name: "deploy"
description: "Builds the project and deploys the dist folder to https://github.com/asimplepeople/shop.git master branch. Invoke when user asks to deploy, publish, or push the project to GitHub."
---

# Deploy Skill

This skill helps you build and deploy the project to a GitHub repository.

## Functionality

1. **Build the project** - Runs `npm run build` to create the production build
2. **Deploy to GitHub** - Pushes the `dist` folder contents to the specified GitHub repository's master branch

## When to Invoke

- User asks to "deploy" the project
- User asks to "publish" or "push to GitHub"
- User wants to make the project live
- User asks to "build and deploy"

## Deployment Steps

### 1. Build the Project

```bash
npm run build
```

This will create a `dist` folder with the production build.

### 2. Deploy to GitHub

The deployment uses the following GitHub repository:
- **Repository**: `https://github.com/asimplepeople/shop.git`
- **Branch**: `master`

#### Method A: Using Git Commands (Recommended)

```bash
# Navigate to dist folder
cd dist

# Initialize git repo (if not already)
git init

# Add the remote repository
git remote add origin https://github.com/asimplepeople/shop.git

# Add all files
git add .

# Commit with timestamp
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to master branch
git push -u origin master --force
```

#### Method B: Using gh-pages (Alternative)

If the repository is set up for GitHub Pages:

```bash
# Install gh-pages if not already
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Then run:
npm run deploy
```

### 3. Verify Deployment

After deployment, verify by:
1. Checking the GitHub repository for updated files
2. If using GitHub Pages, visit the deployed URL

## Prerequisites

- Git must be installed and configured
- User must have write access to the repository
- For HTTPS authentication, user may need to enter credentials or use a personal access token

## Notes

- The `--force` flag is used to ensure the push succeeds, overwriting any existing content
- Always build before deploying to ensure the latest changes are included
- The dist folder is typically in `.gitignore`, so we deploy from within the dist folder itself
