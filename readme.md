# EchoDial (Web)

React app (Vite) built for the frontend of the app

## Notes

- In order for the DigitalOcean App to properly handle the server-side routing, we must configure the Custom Pages' `Catchall` value to be "index.html" (see: https://docs.digitalocean.com/products/app-platform/how-to/manage-static-sites/)
- Seems as though we need to use @emotion/styled instead of styled-components in order to properly obtain the `Theme` object for coloring conditionally (see `SubscriptionItem.tsx`)
- Main dialer logic was hacked together to live within the dialer (at the time `AlphaDialer.tsx`) React components in order to properly leverage the power of RTK Query. The thought of using Thunks was considered, but then we'd essentially be using the escape hatch on RTK Query and the ability to keep the state in sync with the backend, so this was scraped.
- Within dialer, most logic and state is duplicated across redux AND with the `callRef` ref, EXCEPT the call timeout -- this was something that seemed redundant and could cause issues. Didn't see any reason to have this duplicated, did not add value and would only add complications and potential bugs with having two timers running
