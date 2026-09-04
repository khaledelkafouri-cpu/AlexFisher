# AlexFisher — VS Code Setup Guide

This ZIP contains the complete editable source project for the AlexFisher website.

## What you need

- Visual Studio Code
- Node.js 22.13 or newer
- An internet connection for the first dependency installation

Download Node.js from: https://nodejs.org/

## Open the project

1. Extract the ZIP file.
2. Open Visual Studio Code.
3. Select **File → Open Folder**.
4. Choose the extracted `AlexFisher-VSCode-Project` folder.
5. In VS Code, select **Terminal → New Terminal**.

## Install and run the website

Run these commands in the VS Code terminal:

```bash
npm install
npm run dev
```

The terminal will show a local website address. Open that address in your browser. It is usually:

```text
http://localhost:5173
```

Keep the terminal running while you work. Most saved changes will appear automatically in the browser.

## Main files to edit

- `app/page.tsx` — main AlexFisher conditions page, locations, charts, dashboard, and interactions
- `app/globals.css` — colours, typography, desktop layout, mobile layout, and responsive styling
- `app/layout.tsx` — shared page metadata and overall layout
- `app/fishing-hub/` — Fishing Hub page
- `app/tackle-matcher/` — Tackle Matcher tool
- `app/lure-selector/` — Lure & Jig Selector tool
- `app/hook-matcher/` — Hook Matcher tool
- `app/read-my-spot/` — Read My Fishing Spot tool
- `app/learning/` — Learning section
- `app/community/` — Community section
- `app/shop/` — Shop section
- `public/assets/` — logos, mascots, lure images, hooks, and other visual assets
- `db/` and `drizzle/` — community data structure and database migration

## Useful commands

```bash
# Run the local development version
npm run dev

# Check that the production version builds successfully
npm run build

# Check the code style
npm run lint
```

Stop the local server by clicking inside the terminal and pressing `Control + C`.

## Important note

The complete interface and source code are included. Features connected specifically to ChatGPT Sites or its hosted database may require equivalent Cloudflare or hosting configuration if you publish the project through another provider. The local website interface can still be edited and previewed in VS Code.

Do not upload private API keys directly into the source code. Put future secrets in a local `.env` file, which is excluded from Git by the project settings.
