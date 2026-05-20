export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  baseUrl: process.env.EXPO_PUBLIC_BASE_URL!,
  scheme: process.env.EXPO_PUBLIC_SCHEME!,
  // Web client ID — used for ID token validation on the backend
  googleWebClientId:
    "537064981983-25h6bbq5l7ik4ees3c7sdr7dorgo0741.apps.googleusercontent.com",
  // iOS client ID — used by Expo Auth Session on iOS
  googleIosClientId:
    "537064981983-8h8ji2t445j6tf4bds0bn3v85qhikpgn.apps.googleusercontent.com",
  // Android client ID — used by Expo Auth Session on Android
  googleAndroidClientId:
    "537064981983-l6hdp7msam2sckqn8h23fvgp4rn8dd6l.apps.googleusercontent.com",
};
