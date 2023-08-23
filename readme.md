# L34ds (Web)

React app (Vite) built for the frontend of the app

## Notes

- Seems as though we need to use @emotion/styled instead of styled-components in order to properly obtain the `Theme` object for coloring conditionally (see `SubscriptionItem.tsx`)
- Main dialer logic was hacked together to live within the dialer (at the time `AlphaDialer.tsx`) React components in order to properly leverage the power of RTK Query. The thought of using Thunks was considered, but then we'd essentially be using the escape hatch on RTK Query and the ability to keep the state in sync with the backend, so this was scraped.
