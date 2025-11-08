// Helper functions for extracting thumbnails and favicons

/**
 * Extract YouTube thumbnail URL from video URL
 */
export function youtubeThumb(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
      let videoId: string | null = null;
      
      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get("v");
      }
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
  } catch (error) {
    // Invalid URL
  }
  return undefined;
}

/**
 * Get favicon URL for a domain (simple fallback)
 * Note: Favicons are small, so we return undefined instead to avoid blurry images
 * The card will display without an image rather than a blurry favicon
 */
export function domainFavicon(url: string): string | undefined {
  // Return undefined instead of favicon - favicons are too small (128x128) and look blurry when stretched
  // Cards will gracefully handle missing images
  return undefined;
}

