import axios from "axios";

const SERPER_API_KEY = process.env.SERPER_API_KEY || "";

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  // Fields from /news endpoint
  date?: string;
  position?: number;
  // Fields from /videos endpoint
  channel?: string;
  duration?: string;
  videoUrl?: string;
}

export interface SerperResponse {
  organic?: SerperResult[];  // Generic /search endpoint
  news?: SerperResult[];      // /news endpoint
  videos?: SerperResult[];    // /videos endpoint
}

const NEWS_QUERIES = [
  // Core layoff news
  "tech layoffs OR job cuts",
  "AI layoffs OR automation job losses",
  "unemployment rate BLS",

  // Sector-specific queries
  "finance layoffs OR banking job cuts",
  "healthcare layoffs OR hospital job cuts",
  "retail layoffs OR store closures",
];

const VIDEO_QUERIES = [
  "tech layoffs analysis site:youtube.com",
  "resume writing tips site:youtube.com",
  "ATS resume tips site:youtube.com",
  "job interview tips site:youtube.com",
  "how to interview site:youtube.com",
  "career advice layoffs site:youtube.com",
  "resume tips recruiter site:youtube.com",
];

import { youtubeThumb } from "./thumb";

export async function fetchNewsItems(): Promise<SerperResult[]> {
  const allResults: SerperResult[] = [];

  for (const query of NEWS_QUERIES) {
    try {
      const response = await axios.post<SerperResponse>(
        "https://google.serper.dev/news",
        {
          q: query,
          num: 10,
        },
        {
          headers: {
            "X-API-KEY": SERPER_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      // /news endpoint returns { news: [...] }, not { organic: [...] }
      const results = response.data.news || response.data.organic || [];
      if (results.length > 0) {
        // DEBUG: Log full response to see all available fields (only once)
        if (allResults.length === 0) {
          console.log('=== SERPER NEWS RESPONSE (First Result) ===');
          console.log(JSON.stringify(results[0], null, 2));
          console.log('=== FULL RESPONSE KEYS ===');
          console.log(Object.keys(response.data));
        }

        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of results) {
          const enriched: SerperResult = { ...result };

          // If Serper provides imageUrl/thumbnailUrl, use it
          if (result.imageUrl || result.thumbnailUrl) {
            enriched.imageUrl = result.imageUrl || result.thumbnailUrl;
          } else {
            // Otherwise, try to extract YouTube thumbnail from the URL
            const ytThumb = youtubeThumb(result.link);
            if (ytThumb) {
              enriched.imageUrl = ytThumb;
            }
          }

          allResults.push(enriched);
        }
      }
    } catch (error) {
      console.error(`Error fetching news for query "${query}":`, error);
    }
  }

  return allResults;
}

export async function fetchVideoItems(): Promise<SerperResult[]> {
  const allResults: SerperResult[] = [];

  for (const query of VIDEO_QUERIES) {
    try {
      const response = await axios.post<SerperResponse>(
        "https://google.serper.dev/videos",
        {
          q: query,
          num: 10,
        },
        {
          headers: {
            "X-API-KEY": SERPER_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      // /videos endpoint returns { videos: [...] }, not { organic: [...] }
      const results = response.data.videos || response.data.organic || [];
      if (results.length > 0) {
        // DEBUG: Log full response to see all available fields (only once)
        if (allResults.length === 0) {
          console.log('=== SERPER VIDEO RESPONSE (First Result) ===');
          console.log(JSON.stringify(results[0], null, 2));
          console.log('=== VIDEO RESPONSE KEYS ===');
          console.log(Object.keys(response.data));
        }

        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of results) {
          const enriched: SerperResult = { ...result };

          // If Serper provides imageUrl/thumbnailUrl, use it
          if (result.imageUrl || result.thumbnailUrl) {
            enriched.imageUrl = result.imageUrl || result.thumbnailUrl;
          } else {
            // Otherwise, try to extract YouTube thumbnail from the URL
            const ytThumb = youtubeThumb(result.link);
            if (ytThumb) {
              enriched.imageUrl = ytThumb;
            }
          }

          allResults.push(enriched);
        }
      }
    } catch (error) {
      console.error(`Error fetching videos for query "${query}":`, error);
    }
  }

  return allResults;
}

/**
 * Fetch images from Serper Images API
 */
export async function serperImages(q: string): Promise<any> {
  try {
    const response = await axios.post(
      "https://google.serper.dev/images",
      {
        q,
        num: 3,
        gl: "us",
        hl: "en",
      },
      {
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Serper images failed: ${error}`);
  }
}

