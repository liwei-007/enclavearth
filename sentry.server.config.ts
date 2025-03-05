// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1a609842f270031cb5a4429063396244@o4508922928103424.ingest.us.sentry.io/4508922930266112",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  enabled: process.env.NODE_ENV === "production",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
