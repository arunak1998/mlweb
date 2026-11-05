export const CREATOR_NAME = "Arunkumar Ravichandran";

export const SITE_TITLE = "ML Interview Revision Notes";
export const SITE_SUBTITLE = "5-minute revision before your interview";

// Link previews need absolute URLs. Vercel sets this variable on every build.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: SITE_TITLE };
