import axios from "axios";

const SERPER_API_KEY = process.env.SERPER_API_KEY || "";

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface SerperResponse {
  organic: SerperResult[];
}

const NEWS_QUERIES = [
  "tech layoffs OR job cuts",
  "AI layoffs OR automation job losses",
  "unemployment rate BLS",
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
        "https://google.serper.dev/search",
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

      if (response.data.organic) {
        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of response.data.organic) {
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
        "https://google.serper.dev/search",
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

      if (response.data.organic) {
        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of response.data.organic) {
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

