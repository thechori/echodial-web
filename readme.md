# EchoDial Web

React app (Vite) built for the frontend of the app

## Requirements

- Node.js v20.5.0+
- npm v9.8.0+
- ngrok v3.3.1+ (for testing the dialer, see )

## Getting Started

1. Create the `.env.local` file at the root directory, obtain contents from [Ryan Teodoro](ryan@echodial.com)
2. Install dependencies (`npm install`)
3. Run app (`npm run dev`)
4. Visit app on local network (e.g., `http://localhost:5173` -- see terminal output for actual port)

## Development

All features and bugs should live within git branches (e.g., `bucket-module`) and pushed to the remote origin. Once these changes are ready for review, a PR (Pull Request) should be opened and reviewed by an admin or lead. Once this code is reviewed and approved, it can be merged into main and tested in production.

## Deployment

This deployment is managed by DigitalOcean Apps. When code is merged into the `main` branch, the CI/CD pipeline will handle the building of the application and deployment to the site.

_TODO: Update docs once multiple environments are setup_

## Important

- When testing the dialer locally, you must use `ngrok` (see website [here](https://ngrok.com/)) to proxy requests from the [Twilio Webhook]() to your localhost

  - See instructions here for details on how to do this within the Twilio dashboard
    - _TODO: Create doc for this_

- Database migrations are used to update the Postgres schema via knex. When these are completed, be sure to also run the npm script (npm run generate-types:dev) in order to properly update the generates types within the app (output will be at src/types/index.ts)

- Whenever new environment variables are added to the `.env.local` file, corresponding environment variables must be added to the Digital Ocean App settings

## Developer Guide

- Git branches are _preferred_ to named using the Jira namespace and issue number separated by a dash as the prefix, followed by an underscore, followed by a dash-separated short description of the purpose of the branch

  - e.g., `EDM-123_bucket-page` or `EDM-323_user-login-form-fix`
  - **Note**: For the sake of speedy development, this convention may be disregarded when it makes sense -- consult your lead for guidance on this

- Semantic versioning will be used for releases (e.g., `v1.2.3` or `v2.0.0` or `v4.1.23`)

- Mantine elements should be used when possible (e.g., `Box` instead of a `div`)

- Avoid the use of `any` within TypeScript whenever possible. Consult your lead if you find yourself having trouble finding the correct type.

_TODO: Add more here_

## Notes

- In order for the DigitalOcean App to properly handle the server-side routing, we must configure the Custom Pages' `Catchall` value to be "index.html" (see: https://docs.digitalocean.com/products/app-platform/how-to/manage-static-sites/)

- Seems as though we need to use @emotion/styled instead of styled-components in order to properly obtain the `Theme` object for coloring conditionally (see `SubscriptionItem.tsx`)

- Main dialer logic was hacked together to live within the dialer (at the time `AlphaDialer.tsx`) React components in order to properly leverage the power of RTK Query. The thought of using Thunks was considered, but then we'd essentially be using the escape hatch on RTK Query and the ability to keep the state in sync with the backend, so this was scraped.

- Within dialer, most logic and state is duplicated across redux AND with the `callRef` ref, EXCEPT the call timeout -- this was something that seemed redundant and could cause issues. Didn't see any reason to have this duplicated, did not add value and would only add complications and potential bugs with having two timers running
