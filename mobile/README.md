# AlexFisher — Mobile App

This folder wraps the live AlexFisher website in a real native iOS/Android app
shell using [Capacitor](https://capacitorjs.com). The app opens your deployed
site (see `capacitor.config.ts`) inside a native container, so it can be
installed from the App Store / Google Play, show a proper app icon and splash
screen, and get access to native device features later if you want them
(push notifications, camera, GPS, etc).

It does **not** duplicate or fork the website code — `app/`, `db/`, etc. at
the project root are untouched. This is purely a native wrapper around the
live URL.

## One-time setup: point it at your real site

Open [`capacitor.config.ts`](capacitor.config.ts) and replace the placeholder:

```ts
const LIVE_SITE_URL = "https://REPLACE-WITH-YOUR-VERCEL-URL.vercel.app";
```

with your actual deployed URL (your Vercel URL or custom domain). Then re-run
`npx cap sync` so both native projects pick up the change.

> Note: sign-in-with-ChatGPT (SIWC) and the D1-backed community features are
> dispatch-owned by the ChatGPT Sites hosting platform. If you're serving the
> app from Vercel instead, those specific features may not work until they're
> reconfigured for that host — see the root `README.md` and `VS_CODE_SETUP.md`
> for details. Everything else on the site works normally inside the app.

## Requirements to build and run

- **iOS**: a Mac with the full [Xcode](https://apps.apple.com/app/xcode/id497799835)
  app installed (not just the Command Line Tools) and
  [CocoaPods](https://capacitorjs.com/docs/getting-started/environment-setup#cocoapods)
  (`brew install cocoapods`).
- **Android**: [Android Studio](https://developer.android.com/studio) with an
  SDK and at least one emulator (or a USB-connected device with developer
  mode on).
- Node.js 22+ (already required by the main project).

## Everyday commands

Run these from inside this `mobile/` folder:

```bash
npm install          # first time only

npx cap sync          # after changing capacitor.config.ts or plugins

npx cap open ios      # opens the Xcode project — press ▶ to run in Simulator
npx cap open android  # opens the Android Studio project — press ▶ to run
```

There's nothing to "build" for the web content itself — the app just loads
your live site over HTTPS every time it launches, so as soon as you deploy a
change to the website, the app shows it too (no app-store update needed for
ordinary content/UI changes).

## App identity

- **App name**: AlexFisher
- **Bundle/package ID**: `com.alexfisher.app` (set in `capacitor.config.ts`).
  Change this before your first store submission if you want something more
  specific — it becomes permanent for that app listing once published.
- **Icon/splash source**: generated from `assets/icon.png` (the sunfish logo).
  It's currently only 512×512; for a crisper icon on high-res devices, drop a
  1024×1024 (or larger) version of the logo at `assets/icon.png` and re-run:

  ```bash
  npx capacitor-assets generate --iconBackgroundColor '#0b3d5c' --iconBackgroundColorDark '#0b3d5c' --splashBackgroundColor '#0b3d5c' --splashBackgroundColorDark '#0b3d5c'
  ```

## Publishing to the App Store / Google Play

You'll need:
- An [Apple Developer](https://developer.apple.com/programs/) account ($99/yr) to submit to the App Store.
- A [Google Play Console](https://play.google.com/console/) account ($25 one-time) to submit to Google Play.

Once you have those, the general flow is:
1. `npx cap open ios` → in Xcode, set your Apple Developer team under *Signing
   & Capabilities*, then Product → Archive → Distribute App.
2. `npx cap open android` → in Android Studio, Build → Generate Signed Bundle
   / APK, then upload the resulting `.aab` to Play Console.

Ask for help with either of these steps when you're ready — screenshots,
store listing copy, privacy policy, etc. can all be prepared in advance too.
