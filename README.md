# Webhook Receiver for Bitbucket to GitHub Sync

This project provides a webhook receiver for syncing Bitbucket repositories to GitHub. It is Dockerized and designed to run on an on-prem VM.

## Features
- Receives webhooks from Bitbucket Server.
- Creates or updates corresponding GitHub repositories.
- Dockerized for easy deployment.

## Requirements
- Node.js 18+
- Docker
- Bitbucket Server webhook configuration
- GitHub organization or user account

## Setup
1. Install dependencies:
   ```bash
   npm install
