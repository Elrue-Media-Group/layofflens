// Helper functions for extracting thumbnails and favicons

/**
 * Check if a URL is from a known video platform
 */
export function isVideoPlatform(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return true;
    }
    
    // Vimeo
    if (hostname.includes("vimeo.com")) {
      return true;
    }
    
    // LinkedIn Learning
    if (hostname.includes("linkedin.com") && urlObj.pathname.includes("/learning/")) {
      return true;
    }
    
    // TikTok
    if (hostname.includes("tiktok.com")) {
      return true;
    }
    
    // Twitch
    if (hostname.includes("twitch.tv")) {
      return true;
    }
    
    // Dailymotion
    if (hostname.includes("dailymotion.com")) {
      return true;
    }
    
    // Wistia
    if (hostname.includes("wistia.com") || hostname.includes("wistia.net")) {
      return true;
    }
    
    // Loom
    if (hostname.includes("loom.com")) {
      return true;
    }
    
    return false;
  } catch (error) {
    // Invalid URL
    return false;
  }
}

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

