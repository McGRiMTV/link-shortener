<h1 align="center">Atlas Link Shortener</h1>
<p align="center"><strong>A lightweight, open-source custom link shortener built with Node.js and PostgreSQL, designed for easy deployment on Railway using your custom domain.</strong></p>
<br>
<p align="center">
  <a href="https://www.javascript.com/">
    <img src="https://img.shields.io/badge/Made%20with-JavaScript-yellow?style=for-the-badge&logo=javascript" alt="Made with JavaScript">
  </a>
  <br>
  <br>
  <img src="https://img.shields.io/badge/node.js-v22.15.0-339933?logo=node.js&logoColor=white&style=flat" alt="Node.js v22.15.0">
  <img src="https://img.shields.io/badge/deployed%20on-Railway-0B0D0E?logo=railway&logoColor=white&style=flat" alt="Deployed on Railway">
  <img src="https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat" alt="PostgreSQL">
  <br>
  <br>
  <img src="https://img.shields.io/badge/express-v5.2.2-000000?logo=express&logoColor=white&style=flat" alt="express 5.2.1">
  <img src="https://img.shields.io/badge/pg-v8.20.0-336791?logo=postgresql&logoColor=white&style=flat" alt="pg v8.20.0">
  <img src="https://img.shields.io/badge/ejs-v5.0.2-B4CA65?logo=html5&logoColor=white&style=flat" alt="ejs v5.0.2">
  <br>
  <br>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-0298c3.svg?logo=opensourceinitiative&logoColor=white&style=flat" alt="License: MIT">
  </a>
</p>
<br>
<br>

## Getting Started

### Architecture
* **Frontend:** EJS (Server-side rendered HTML/CSS)
* **Backend API:** Node.js / Express
* **Database:** PostgreSQL
* **Domain:** Your custom domain `e.g., go.yourdomain.com` (Routed through Cloudflare)

#### 1. Database Setup
1. Create a new PostgreSQL database instance in your Railway project (or your own SQL).
2. Connect to your new database using the Railway CLI or a tool like pgAdmin/DBeaver.
3. Run the following SQL command to create the necessary table structure:

```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_protected BOOLEAN DEFAULT FALSE,
    password VARCHAR(255)
);
```

#### 2. Railway Deployment*
1. Fork or clone this repository and deploy it via the [Railway dashboard](https://railway.com/dashboard)\*\*.
2. In your Railway Project Settings, navigate to the **Variables** tab.
3. Add the following environment variables\*\*\*:

| Variable | Value Description |
| :--- | :--- |
| `DATABASE_URL` |The connection string for your PostgreSQL database (Railway provides this automatically via `${{ Postgres.DATABASE_URL }}` ). |
| `ADMIN_USER` | Your desired username for the admin dashboard. |
| `ADMIN_PASS` | Your secure password for the admin dashboard. |
| `SESSION_SECRET` | A randomized string used to encrypt session cookies ([Generate a Secret](https://api.madebyatlas.dev/password?length=40)). |
| `NODE_ENV` | Set this to `production` to enable secure cookies. |

*\*Other deployment options are possible, Railway is just suggested for ease.*<br>
*\*\*Railway will automatically install the necessary NPM dependencies during the build phase.*<br>
*\*\*\*For deployment elsewhere you can use a standard `.env` file and insert the variables as such (e.g. `ADMIN_PASS=SuperSecretPassword`, etc).*

#### 3. Usage & Configuration
1. Go to `https://go.yourdomain.com/`
2. Log in using the ADMIN_USER and ADMIN_PASS you configured in Railway.
3. Create your custom shortlinks directly from the dashboard. (e.g., creating the custom name `website` will map `https://go.yourdomain.com/website` to your destination URL).

## Change Log
[View Change Log](CHANGELOG.md)

## Support
For support regarding this repository please join the [Atlas Development Discord Server](https://discord.gg/atlasdev)
### Bug Reporting
Please join the Discord server linked above and submit a bug via the `#bugs` forum.

## License
This project is licensed under the MIT License.<br>
This is a permissive license with conditions only requiring preservation of copyright and license notices.<br>
Licensed works, modifications, and larger works may be distributed under different terms and without source code.

The license is viewable [here](LICENSE).

## Authors
**McGRiM** • [Website](https://mcgrim.dev) | [GitHub](https://github.com/McGRiMTV)

**Atlas Development** • [Website](https://madebyatlas.dev) | [GitHub](https://github.com/madebyatlas) | [Discord](https://discord.gg/atlasdev) | [Terms of Use](https://madebyatlas.dev/terms) | [Privacy Policy](https://madebyatlas.dev/privacy)

Copyright (c) 2026, 
McGRiM / Atlas Development
All rights reserved.