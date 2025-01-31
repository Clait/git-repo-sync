const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BITBUCKET_TOKEN = process.env.BITBUCKET_TOKEN;
const LOCAL_REPOS_DIR = process.env.LOCAL_REPOS_DIR || '/tmp/repos';

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(stderr || error.message);
            else resolve(stdout);
        });
    });
}

async function syncRepository(repoName, bitbucketCloneUrl) {
    const repoPath = path.join(LOCAL_REPOS_DIR, repoName);

    if (!fs.existsSync(repoPath)) {
        await executeCommand(`git clone --mirror ${bitbucketCloneUrl} ${repoPath}`);
    } else {
        await executeCommand(`cd ${repoPath} && git fetch`);
    }

    const githubCloneUrl = `https://github.com/${GITHUB_ORG}/${repoName}.git`;
    await executeCommand(
        `cd ${repoPath} && git remote add github ${githubCloneUrl} || true && git push github --mirror`
    );
}

app.post('/webhook', async (req, res) => {
    try {
        const { repository } = req.body;
        if (!repository) throw new Error('No repository data in webhook.');

        const { name, links } = repository;
        const bitbucketCloneUrl = links.clone[0].href;
        await syncRepository(name, bitbucketCloneUrl);
        res.status(200).send('Repository synced successfully!');
    } catch (error) {
        console.error('Error syncing repository:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Export app for testing purposes
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});
