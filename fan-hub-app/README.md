# Spurs Fan Hub App

React Native / Expo version of the Spurs Fan Hub web app.

## Run In Mock Mode

Use mock mode while developing locally:

```bash
npm run mock
```

Mock mode sets `EXPO_PUBLIC_MOCK_API=1`, which forces the app to use local fixture data from `lib/fixtures.ts`. It does not call Sportradar or any backend API, even if `EXPO_PUBLIC_API_BASE_URL` is present.

## Optional API Mode

The app can read from a mobile API later by setting:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
```

Leave `EXPO_PUBLIC_MOCK_API` unset for API mode. If `EXPO_PUBLIC_MOCK_API=1`, fixtures always win.

## Current Screens

- Home feed with Live Updates, Playoff Pulse, Next Up, Recent Results, Upcoming, and Possible Games.
- Game detail with matchup summary, team comparison, lineups, players to watch, charts, Fan Shop carousel, and Dot Race.
- Full Fan Shop route with item selection, jersey sizing, order confirmation, pickup details, and confirmation animation.
