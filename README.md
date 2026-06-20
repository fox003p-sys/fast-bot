# FastBot - Mobile App for vkserfing.com

A cross-platform mobile application built with Expo/React Native for managing bot activities, campaigns, and posts on vkserfing.com.

## Features

- ✅ **User Authentication**: Secure login and registration with token-based auth
- ✅ **Campaign Management**: Create, view, and manage ad campaigns
- ✅ **Post Management**: View, like, comment, and share posts
- ✅ **User Profile**: View and manage user profile and settings
- ✅ **Real-time Stats**: Dashboard with performance metrics
- ✅ **Secure Token Storage**: Uses Expo SecureStore for safe token management
- ✅ **Cross-platform**: Works on iOS and Android
- ✅ **Production-ready**: EAS build configuration included

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g eas-cli expo-cli`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fox003p-sys/fast-bot.git
cd fast-bot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your platform:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

## Project Structure

```
fast-bot/
├── src/
│   ├── api/
│   │   ├── client.js          # Axios client with interceptors
│   │   └── endpoints.js       # API endpoint functions
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── screens/
│   │   ├── auth/              # Login and Register screens
│   │   ├── home/              # Home dashboard
│   │   ├── campaigns/         # Campaign management screens
│   │   ├── posts/             # Posts browsing
│   │   └── profile/           # User profile
│   └── utils/
│       └── tokenStorage.js    # Secure token management
├── app.json                   # Expo configuration
├── eas.json                   # EAS build configuration
└── App.js                     # Main entry point
```

## Configuration

### API Endpoints

Update the API base URL in `src/api/client.js`:

```javascript
const BASE_URL = 'https://api.vkserfing.com';
```

### Build Configuration

Edit `eas.json` to configure your build settings, app signing, and submission profiles.

## Building for Production

### Prerequisites
- EAS CLI: `npm install -g eas-cli`
- EAS account at https://expo.dev

### Build

```bash
# Login to EAS
eas login

# Build for all platforms
eas build --platform all

# Build for specific platform
eas build --platform ios
eas build --platform android
```

### Submit to App Stores

```bash
# Submit to App Store and Google Play
eas submit --platform all
```

## API Integration

The app is configured to work with mock data by default. To connect to real API endpoints:

1. Update API endpoints in `src/api/endpoints.js`
2. Configure your backend authentication method
3. Update `App.js` authentication logic if needed

### Example API Integration

```javascript
// In src/api/endpoints.js
export const authAPI = {
  login: (username, password) =>
    client.post('/auth/login', { username, password }),
  // ... other endpoints
};

// In screens/auth/LoginScreen.js
const result = await signIn(username, password);
```

## Security Best Practices

- Tokens are stored using Expo SecureStore (encrypted)
- API requests include authorization headers automatically
- HTTPS is enforced for all API calls
- Sensitive data is never logged

## Troubleshooting

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
exp start -c
```

### API Connection Issues

1. Check network connectivity
2. Verify API endpoint URL
3. Check authentication token is valid
4. Review API request logs in DevTools

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project as a template.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Expo documentation: https://docs.expo.dev
3. Check React Navigation docs: https://reactnavigation.org
