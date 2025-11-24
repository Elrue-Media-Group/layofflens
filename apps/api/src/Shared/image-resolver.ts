import { serperImages } from "./serper";
import { youtubeThumb, domainFavicon } from "./thumb";

export interface ImageItem {
  url: string;
  title: string;
  image?: string;
  thumbnailUrl?: string;
  source?: string;
}

/**
 * Find the best image for an item using multiple strategies
 * 1. Use provided image/thumbnailUrl (if high quality, not low-res Google thumbnails)
 * 2. Extract YouTube thumbnail (high-res maxresdefault.jpg)
 * 3. Try Serper Images API (with site filter for better quality)
 * 4. Return undefined if no image found (no blurry favicons)
 */
export async function bestImageFor(item: ImageItem): Promise<string | undefined> {
  // 1) Provided by result (but reject if it's a low-res Google thumbnail)
  const direct = item.image || item.thumbnailUrl;
  if (direct && !direct.includes('encrypted-tbn0.gstatic.com')) {
    return direct;
  }

  // 2) YouTube derived - high-res maxresdefault.jpg
  const yt = youtubeThumb(item.url);
  if (yt) return yt;

  // 3) Serper Images with site filter
  try {
    const host = new URL(item.url).hostname.replace(/^www\./, "");
    const q = `${item.title} site:${host}`;
    const imgJson = await serperImages(q);
    const c = imgJson.images?.[0];
    // Prefer imageUrl, but also accept thumbnailUrl if it's not a favicon
    if (c?.imageUrl && !c.imageUrl.includes('favicons')) {
      return c.imageUrl;
    }
    if (c?.thumbnailUrl && !c.thumbnailUrl.includes('favicons')) {
      return c.thumbnailUrl;
    }
  } catch {
    // ignore any Serper error
  }

  // 4) No image found - return undefined (don't use blurry favicons)
  return undefined;
}

