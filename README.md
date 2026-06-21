# VKSerfing Mobile Bot App

Cross-platform mobile client (React Native + Expo) for [vkserfing.com](https://vkserfing.com).

## Features

- WebView authentication (VK, Telegram, Instagram, etc.)
- Task feed with platform filters
- Task completion flow with manual confirmation
- Push/local notifications
- Search (tasks & users)
- Multi-account support
- Dark/light/system theme
- Secure token storage (Expo SecureStore)
- Official advertiser API integration
- Mock API mode for development

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

## Documentation

- [Technical Specification (TZ)](./TECHNICAL_SPEC.md) — full architecture & requirements
- [Deployment Guide](./docs/DEPLOYMENT.md) — build, configure, publish
- [**API Reverse Engineering**](./docs/REVERSE_ENGINEERING.md) — capture internal endpoints
- [Endpoint Registry](./docs/ENDPOINTS.md) — table + JSON spec
- [Postman Collection](./docs/postman/vkserfing.postman_collection.json)

## Capture tools

```bash
# 1. Save HAR from Chrome DevTools → Network → Save all as HAR
node tools/parse-har.js tools/captures/session.har --output docs/endpoints-captured.json

# 2. Or paste tools/capture-snippet.js in browser console, export JSON, then:
node tools/merge-capture.js tools/captures/console-capture.json

# 3. Auto-update app registry (review diff!)
node tools/apply-capture-to-registry.js docs/endpoints-captured.json
```

## Project Structure

```
app/           Expo Router screens
src/api/       Official + internal API clients
src/store/     Zustand state management
src/services/  Storage, notifications
src/components UI components
```

## Important Notes

1. **Official API** is for advertisers only — request token from vkserfing.com support.
2. **Executor endpoints** are not public — update `src/api/config.ts` after DevTools discovery.
3. **App Store compliance** — position as a task exchange client, not an automation bot.
4. Set `EXPO_PUBLIC_ENABLE_MOCK_API=false` for production builds with real sessions.

## License

Private / educational prototype. Respect vkserfing.com Terms of Service.
