import 'dotenv/config';

export default {
  expo: {
    name: 'Slate',
    slug: 'Slate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'slate',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.byvalvin.Slate"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      package: "com.byvalvin.Slate"
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.720148251097-6cgsfjnnfl4ia1p6dl4hge7es30ju5s4"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      eas: {
        projectId: "dfbbfd2d-c791-483e-9ee8-a02096bcac37"
      }
    }
  }
};