import type { CapacitorConfig } from "@capacitor/cli";

// TODO: replace with your real deployed site before building for a device or
// submitting to a store. This must be a live, reachable HTTPS URL.
const LIVE_SITE_URL = "https://REPLACE-WITH-YOUR-VERCEL-URL.vercel.app";

const config: CapacitorConfig = {
  // Reverse-DNS style unique app identifier. Change this before your first
  // store submission — it cannot be changed afterward without publishing a
  // new app listing.
  appId: "com.alexfisher.app",
  appName: "AlexFisher",
  // Local fallback shell copied into the native app bundle (used briefly on
  // launch and if the live site can't be reached). The real UI is loaded
  // live from LIVE_SITE_URL below.
  webDir: "www",
  server: {
    url: LIVE_SITE_URL,
    cleartext: false,
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0b3d5c",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
