import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchNewsItems, fetchVideoItems } from "../Shared/serper";
import { saveItem, FeedItem, cleanupOldItems } from "../Shared/storage";
import { calculateScore } from "../Shared/scoring";
import { bestImageFor } from "../Shared/image-resolver";
import { isVideoPlatform } from "../Shared/thumb";
import { extractLayoffData } from "../Shared/layoff-extractor";

const IMAGE_LOOKUP_CAP = 8; // Limit Serper Images API calls per run to stay within free tier

async function fetchAndSaveItems(): Promise<number> {
  const now = new Date();
  let savedCount = 0;
  let imageLookups = 0;

  const newsItems = await fetchNewsItems();
  for (const news of newsItems) {
    const partitionKey = "news";
    const rowKey = Buffer.from(news.link).toString("base64").replace(/[/+=]/g, "").substring(0, 63);

    // Check if item already exists in storage
    const { getItem } = await import("../Shared/storage");
    const existingItem = await getItem(partitionKey, rowKey);

    // If item exists and already has a good image, skip expensive enrichment
    if (existingItem?.imageUrl && !existingItem.imageUrl.includes('encrypted-tbn0.gstatic.com')) {
      // Existing item with valid image - just update metadata and score
      const layoffData = await extractLayoffData(news.title, news.snippet);
      const item: FeedItem = {
        ...existingItem,
        title: news.title,
        snippet: news.snippet,
        tags: JSON.stringify(extractTags(news.title, news.snippet)),
        score: 0,
        companyName: layoffData.companyName,
        layoffCount: layoffData.layoffCount,
        sector: layoffData.sector,
        position: news.position,
      };
      item.score = calculateScore(item, now);
      await saveItem(item);
      savedCount++;
      continue; // Skip image enrichment for existing items
    }

    // New item or existing item with bad/no image - do full processing
    const layoffData = await extractLayoffData(news.title, news.snippet);

    const item: FeedItem = {
      partitionKey,
      rowKey,
      title: news.title,
      link: news.link,
      source: news.source || new URL(news.link).hostname,
      snippet: news.snippet,
      date: now.toISOString(),
      type: "news",
      tags: JSON.stringify(extractTags(news.title, news.snippet)),
      score: 0,
      imageUrl: undefined, // Will be enriched by bestImageFor() below for better quality
      // Add layoff tracking data
      companyName: layoffData.companyName,
      layoffCount: layoffData.layoffCount,
      sector: layoffData.sector,
      // Add Serper metadata
      position: news.position,
    };

    // Enrich image for new items only (saves API calls on duplicates)
    if (imageLookups < IMAGE_LOOKUP_CAP) {
      try {
        const enrichedImage = await bestImageFor({
          url: item.link,
          title: item.title,
          // Don't pass Serper's low-res thumbnails - force Serper Images API lookup for better quality
          image: undefined,
          thumbnailUrl: undefined,
          source: item.source,
        });
        // Only use if it's not a favicon (favicons are too small and blurry)
        if (enrichedImage && !enrichedImage.includes('favicons')) {
          item.imageUrl = enrichedImage;
          imageLookups++;
        }
      } catch (error) {
        // If lookup fails, leave imageUrl undefined (no blurry favicon)
      }
    }
    // If cap is reached or lookup failed, leave imageUrl undefined
    // Cards will display without image rather than blurry favicon
    
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  const videoItems = await fetchVideoItems();
  for (const video of videoItems) {
    const partitionKey = "news";
    const rowKey = Buffer.from(video.link).toString("base64").replace(/[/+=]/g, "").substring(0, 63);

    // Check if item already exists in storage
    const { getItem } = await import("../Shared/storage");
    const existingItem = await getItem(partitionKey, rowKey);

    // If item exists and already has a good image, skip expensive enrichment
    if (existingItem?.imageUrl && !existingItem.imageUrl.includes('encrypted-tbn0.gstatic.com')) {
      // Existing item with valid image - just update metadata and score
      const layoffData = await extractLayoffData(video.title, video.snippet);
      const isVideo = isVideoPlatform(video.link);
      const item: FeedItem = {
        ...existingItem,
        title: video.title,
        snippet: video.snippet,
        type: isVideo ? "video" : "news",
        tags: JSON.stringify(extractTags(video.title, video.snippet)),
        score: 0,
        companyName: layoffData.companyName,
        layoffCount: layoffData.layoffCount,
        sector: layoffData.sector,
        channel: video.channel,
        duration: video.duration,
        position: video.position,
      };
      item.score = calculateScore(item, now);
      await saveItem(item);
      savedCount++;
      continue; // Skip image enrichment for existing items
    }

    // New item or existing item with bad/no image - do full processing
    const layoffData = await extractLayoffData(video.title, video.snippet);

    // Classify as video if it's from any known video platform
    const isVideo = isVideoPlatform(video.link);
    const item: FeedItem = {
      partitionKey,
      rowKey,
      title: video.title,
      link: video.link,
      source: video.source || new URL(video.link).hostname,
      snippet: video.snippet,
      date: now.toISOString(),
      type: isVideo ? "video" : "news", // Classify as news if not from a video platform
      tags: JSON.stringify(extractTags(video.title, video.snippet)),
      score: 0,
      imageUrl: undefined, // Will be enriched by bestImageFor() below for better quality
      // Add layoff tracking data
      companyName: layoffData.companyName,
      layoffCount: layoffData.layoffCount,
      sector: layoffData.sector,
      // Add video-specific Serper data
      channel: video.channel,
      duration: video.duration,
      position: video.position,
    };

    // Enrich image for new items only (saves API calls on duplicates)
    if (imageLookups < IMAGE_LOOKUP_CAP) {
      try {
        const enrichedImage = await bestImageFor({
          url: item.link,
          title: item.title,
          // Don't pass Serper's low-res thumbnails - let it extract YouTube high-res or use Serper Images
          image: undefined,
          thumbnailUrl: undefined,
          source: item.source,
        });
        // Only use if it's not a favicon (favicons are too small and blurry)
        if (enrichedImage && !enrichedImage.includes('favicons')) {
          item.imageUrl = enrichedImage;
          imageLookups++;
        }
      } catch (error) {
        // If lookup fails, leave imageUrl undefined (no blurry favicon)
      }
    }
    // If cap is reached or lookup failed, leave imageUrl undefined
    // Cards will display without image rather than blurry favicon
    
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  return savedCount;
}

function extractTags(title: string, snippet: string): string[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const tags: string[] = [];

  // Layoffs and job cuts
  if (text.includes("layoff") || text.includes("job cut") || text.includes("job loss")) {
    tags.push("Layoffs");
  }
  
  // AI and automation
  if (text.includes("ai") || text.includes("artificial intelligence")) {
    tags.push("AI");
  }
  if (text.includes("automation")) {
    tags.push("Automation");
  }
  
  // Unemployment
  if (text.includes("unemployment")) {
    tags.push("Unemployment");
  }
  
  // Hiring freezes
  if (text.includes("hiring freeze") || text.includes("hiring pause")) {
    tags.push("Hiring Freeze");
  }
  
  // Resume and ATS
  if (text.includes("resume") || text.includes("cv ") || text.includes("curriculum vitae")) {
    tags.push("Resume Writing");
  }
  if (text.includes("ats") || text.includes("applicant tracking system")) {
    tags.push("ATS");
  }
  
  // Interview tips
  if (text.includes("interview") || text.includes("interviewing")) {
    tags.push("Interview Tips");
  }
  
  // Job search general
  if (text.includes("job search") || text.includes("find a job") || text.includes("job hunting")) {
    tags.push("Job Search");
  }
  
  // Career advice
  if (text.includes("career advice") || text.includes("career tips") || text.includes("career guidance")) {
    tags.push("Career Advice");
  }
  
  // Networking
  if (text.includes("networking") || text.includes("linkedin")) {
    tags.push("Networking");
  }

  return tags;
}

export async function fetchNowHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const token = request.query.get("token");
    const expectedToken = process.env.ADMIN_TOKEN || "change-me";

    if (token !== expectedToken) {
      return {
        status: 401,
        jsonBody: { error: "Unauthorized. Invalid token." },
      };
    }

    context.log("Starting manual fetch...");
    const savedCount = await fetchAndSaveItems();
    context.log(`Saved ${savedCount} items`);

    // Clean up old items (older than 90 days)
    const retentionDays = parseInt(process.env.RETENTION_DAYS || "90", 10);
    context.log(`Starting cleanup of items older than ${retentionDays} days...`);
    const deletedCount = await cleanupOldItems(retentionDays);
    context.log(`Cleanup completed. Deleted ${deletedCount} old items`);

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: `Fetched and saved ${savedCount} items, deleted ${deletedCount} old items`,
        saved: savedCount,
        deleted: deletedCount,
      },
    };
  } catch (error: any) {
    context.error("Error fetching items:", error);
    return {
      status: 500,
      jsonBody: { error: error.message || "Internal server error" },
    };
  }
}

app.http("FetchNowHttp", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: fetchNowHttp,
});

