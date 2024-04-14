import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// now for improving the perfomance and to manage it, or to show what actually goin on our website, i am using sentry,
// so to first install this run the command : npm install --save @sentry/react

// then importing this sentry with few lines of code in main.jsx

// after that again run this command to automatically upload the source map of this project to enable readable stack trace for errors: npx @sentry/wizard@latest -i sourcemaps

// below in this component, there is a reference of terminal code, that what are the thing that it gonna ask, and how finally we setup the sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://d674932a77e6d9b9ced1190d70fd4691@o4506876178464768.ingest.us.sentry.io/4506876181151744",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.metrics.metricsAggregatorIntegration(),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


{/* 
PS D:\Project\Js Mastery react projects\apple_website> npx @sentry/wizard@latest -i sourcemaps
Running Sentry Wizard...
version: 3.22.0 | sentry-cli version: 1.77.3
Sentry Wizard will help you to configure your project        
Thank you for using Sentry :)
Skipping connection to Sentry due files already patched      

┌   Sentry Source Maps Upload Configuration Wizard 
│
◇   ──────────────────────────────────────────────────────────────────────────────────╮
│                                                            
                         │
│  This wizard will help you upload source maps to Sentry as part of your build.      │
│  Thank you for using Sentry :)                             
                         │
│                                                            
                         │
│  (This setup wizard sends telemetry data and crash reports to Sentry.               │
│  You can turn this off by running the wizard with the '--disable-telemetry' flag.)  │
│                                                            
                         │
│  Version: 3.22.0                                           
                         │
│                                                            
                         │
├─────────────────────────────────────────────────────────────────────────────────────╯
│
▲  You have uncommitted or untracked files in your repo:     
│
│  - package-lock.json
│
│  The wizard will create and update files.
│
◇  Do you want to continue anyway?
│  Yes
│
◇  Are you using Sentry SaaS or self-hosted Sentry?
│  Sentry SaaS (sentry.io)
│
◇  Do you already have a Sentry account?
│  Yes
│
●  If the browser window didn't open automatically, please open the following link to log into Sentry:
│
│  https://sentry.io/account/settings/wizard/me32ydcoabcwnliq6oisom66a0ep1s2aub3ixk54gab0w7qwydeck65arhytrbjk/
│
◇  Login complete.
│
◇  Select your Sentry project.
│  jsm-zb/javascript-react
│
◆  Which framework, bundler or build tool are you using?     
│  ○ Angular
│  ○ Create React App
│  ○ Next.js
│  ○ Remix
│  ○ Webpack
◇  Which framework, bundler or build tool are you using?     
│  Vite
│
◇  Installed @sentry/vite-plugin with NPM.
│
◆  Added the Sentry Vite plugin to vite.config.js and enabled source maps
│
●  We recommend checking the modified file after the wizard finished to ensure it works with your build setup.
│
◆  Created .env.sentry-build-plugin with auth token for you to test source map uploading locally.
│
◆  Added .env.sentry-build-plugin to .gitignore.
│
◇  Are you using a CI/CD tool to build and deploy your       
application?
│  Yes
│
◇  Add the Sentry authentication token as an environment variable to your CI setup:

SENTRY_AUTH_TOKEN=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

│
▲  DO NOT commit this auth token to your repository!
│
◇  Did you configure CI as shown above?
│  Yes, continue!
│
└  That's it - everything is set up!

   Test and validate your setup locally with the following Steps:

   1. Build your application in production mode.
      → For example, run npm run build.
      → You should see source map upload logs in your console.
   2. Run your application and throw a test error.
      → The error should appear in Sentry:
      → https://jsm-zb.sentry.io/issues/?project=4507074380300288
   3. Open the error in Sentry and verify that it's source-mapped.
      → The stack trace should show your original source code.

   If you encounter any issues, please refer to the Troubleshooting Guide:
   https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js

   If the guide doesn't help or you encounter a bug, please let us know:
   https://github.com/getsentry/sentry-javascript/issues     



🎉  Successfully set up Sentry for your project 🎉

*/}
