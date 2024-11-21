# .ask

## Overview

.ask is an anonymous question-asking platform similar to NGL, designed to be self-hosted for maximum control and privacy. It leverages Cloudflare's network for fast and reliable performance, ensuring that your platform is always accessible. With a focus on security and user control, .ask allows you to manage your data independently. Its intuitive interface makes it simple to ask and answer questions anonymously, making it an ideal solution for both personal and community use.

## Features

- **Anonymous Questions**: Users can ask questions anonymously without revealing their identity.
- **Self-Hosted**: Complete control over your data and privacy by hosting the platform yourself.
- **Cloudflare Integration**: Utilizes Cloudflare's network for fast and reliable performance.
- **Intuitive Interface**: Easy-to-use interface for asking and answering questions.
- **Social Share Ready**: Answered will be generated into socialmedia shareable card which you can directly share right from the app.
- **Security Focused**: Ensures data security with JWT authentication.
- **Customizable**: Customize the platform to fit your needs
- **Community Friendly**: Ideal for both personal use and community engagement.
- **Open Source**: Contributions are welcome, and the project is licensed under GPL 3.0.

## Deploy

### Requirements

1. Login to cloudflare, create a worker project named `ask-api` and create another pages project named `ask-web`

2. Generate a Cloudflare api token following this link: <https://link.shovon.me/wrangler-token>

3. Crate an account on NeonDB and get the connection string. Follow this guide if needed: <https://link.shovon.me/neon-string>

4. Create a JWT secret from here (length 32): <https://link.shovon.me/gen-jwt> or run this in terminal `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Deploy With GitHub Actions

1. Create a new repo using this template

2. Goto the repo Settings -> Secrets and variables -> Actions. On Repository secrets section add these secrets

| Name                 | Value                                    | Requirement |
| -------------------- | ---------------------------------------- | ----------- |
| CLOUDFLARE_API_TOKEN | Token generated from requirements step 2 | Required    |
| NEON_DATABASE_URL    | DB URL string from requirements step 3   | Required    |
| JWT_SECRET           | JWT secret from requirements step 4      | Required    |
| DEFAULT_USER         | Default username for login               | Required    |
| DEFAULT_PASSWORD     | Default password for login               | Required    |
| API_CUSTOM_DOMAIN    | Custom domain for ask api                | Optional    |

3. Goto the `Actions` tab on the repo, select `Deploy API and Web` action, select `Run workflow`, branch main, `Run workflow`

### Manual Deployment

1. Clone this repo locally and run `pnpm install`

2. Open `apps/api/wrangler.toml`, if you are going to use a custom domain for the short link, uncomment line 4 and replace `{{CUSTOM_DOMAIN}}` with your custom domain.

3. Create a `.env` file in `apps/api/` and fill in NEON_DATABASE_URL, DEFAULT_USER and DEFAULT_PASSWORD

4. Put the Neon database string on worker secret using: `pnpm db:set`

5. Put the JWT secret on worker using: `pnpm jwt:secret:set`

6. Run `pnpm worker:deploy:api` to deploy the api

7. Create a `.env` file in `apps/web/` and fill in `NEXT_PUBLIC_WORKER` with the custom domain or the worker url got from previous command

8. Run `pnpm pages:deploy:web` to deploy the web client

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

```sh
git checkout -b feature-branch
```

3. Make your changes and commit them:

```sh
git commit -m "Description of changes"
```

4. Push to the branch:

```sh
git push origin feature-branch
```

5. Create a pull request.

### License

This project is licensed under the GPL 3.0 License. See the [COPYING](COPYING) file for details.

### Contact

For any questions or feedback, please open an issue
