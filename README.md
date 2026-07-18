# CI/CD Pipeline Simulator

Most freshers can build an app. Almost none can ship and operate one.

This project simulates a real deployment pipeline end to end: every push to `main` is automatically linted, tested, containerized, deployed, and the team is notified — with zero manual steps.

## Live Demo

🔗 https://cicd-pipeline-demo-production.up.railway.app/health

## Pipeline Overview

```
Push to GitHub → Lint (ESLint) → Test (Jest + Supertest) → Build (Docker → GHCR)
→ Deploy (Railway, auto-triggered on push to main) → Notify (Slack webhook)
```

Every stage runs automatically. If lint or tests fail, the pipeline stops there — broken code never reaches the build or deploy stage.

## Tech Stack

- **App:** Node.js, Express
- **Testing:** Jest, Supertest
- **Containerization:** Docker
- **CI:** GitHub Actions (lint → test → build → notify)
- **Deployment:** Railway (auto-deploys on push to `main`)
- **Notifications:** Slack Incoming Webhooks

## Why These Choices

- **Railway over raw EC2** — prioritized shipping a fully working, auto-deploying pipeline over manual server configuration. The same GitHub Actions workflow structure could target EC2 with a different deploy step.
- **GHCR over Docker Hub** — native GitHub authentication, no extra account or credentials to manage.
- **Two parallel automated systems, not one chained pipeline** — GitHub Actions independently verifies code quality (lint/test/build) on every push, while Railway independently watches the same branch and deploys. This is simpler to reason about and debug than a single monolithic pipeline, though a more advanced setup could gate the Railway deploy on CI passing first.

## Run Locally

```bash
git clone https://github.com/veenareddy305/cicd-pipeline-demo.git
cd cicd-pipeline-demo
npm install
npm test
docker build -t cicd-demo .
docker run -p 3000:3000 cicd-demo
```

Visit `http://localhost:3000/health` — you should see `{"healthy":true}`.

## Use This as a Template

This pipeline isn't tied to this specific app — the CI/CD structure is reusable for any Node.js project. To adapt it:

1. **Fork this repo** (or copy `.github/workflows/ci.yml` and the `Dockerfile` into your own project)
2. **Replace `server.js`** with your own app — keep the `/health` endpoint if you want the same health-check pattern
3. **Update `package.json`** scripts (`start`, `test`, `lint`) to match your app's actual commands
4. **Point deployment at your own Railway project** — connect your fork's GitHub repo in Railway, generate a new domain
5. **Set your own `SLACK_WEBHOOK` secret** in your repo's Settings → Secrets and variables → Actions
6. **Update the Docker image tags** in `ci.yml` if you want a different container registry

That's it — push to `main` and the same lint → test → build → deploy → notify flow runs against your app instead.

## What I'd Add at Scale

- Gate the Railway deploy on GitHub Actions tests passing, instead of running them as independent parallel checks
- A staging environment with manual approval before production
- Blue-green deploys to eliminate brief downtime during container swap
- Automatic rollback triggered by a failed post-deploy health check

## A Real Debugging Note

While building this, ESLint's newer flat-config format broke my first CI run — the pipeline correctly caught the config mismatch and failed the build before anything broken shipped. That's exactly what a CI pipeline is supposed to do: catch problems before they become production incidents, not just run happy-path checks.