/**
 * Content preview mode.
 *
 * Enabled only when CONTENT_PREVIEW=true. It shows draft projects and
 * unconfirmed content with clear labels and asks search engines not to index
 * anything. Never enable it on the public production deployment.
 */
export const isPreview = process.env.CONTENT_PREVIEW === "true";
