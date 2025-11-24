import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getItemsForDays } from "../Shared/storage";

interface ChannelStats {
  channel: string;
  videoCount: number;
  totalDuration: number; // in seconds
  avgDuration: number; // in seconds
  avgPosition: number; // average search ranking
}

interface TopChannelsResponse {
  channels: ChannelStats[];
  summary: {
    totalVideos: number;
    totalChannels: number;
    totalWatchTime: number; // in seconds
  };
}

/**
 * Convert duration string (e.g., "8:35", "1:02:15") to seconds
 */
function durationToSeconds(duration: string): number {
  if (!duration) return 0;

  const parts = duration.split(':').map(p => parseInt(p, 10));

  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

/**
 * Convert seconds to human-readable duration
 */
function secondsToHumanReadable(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export async function getTopChannelsHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log("GetTopChannelsHttp called");

    const daysParam = request.query.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30; // Default to 30 days

    if (isNaN(days) || days < 1) {
      return {
        status: 400,
        jsonBody: { error: "Invalid days parameter. Must be a positive integer." },
      };
    }

    context.log(`Fetching items for ${days} days`);
    const items = await getItemsForDays(days);
    context.log(`Fetched ${items.length} items`);

    // Filter to only video items with channel data
    const videoItems = items.filter((item: any) =>
      item.type === 'video' &&
      item.channel &&
      item.channel !== 'null' &&
      item.channel !== 'undefined'
    );

    context.log(`Filtered to ${videoItems.length} videos with channel data`);

    // Aggregate by channel
    const channelMap = new Map<string, {
      count: number;
      totalDuration: number;
      totalPosition: number;
      positionCount: number;
    }>();

    videoItems.forEach((item: any) => {
      const channel = item.channel;
      const existing = channelMap.get(channel) || {
        count: 0,
        totalDuration: 0,
        totalPosition: 0,
        positionCount: 0,
      };

      existing.count += 1;

      if (item.duration) {
        existing.totalDuration += durationToSeconds(item.duration);
      }

      if (item.position && typeof item.position === 'number') {
        existing.totalPosition += item.position;
        existing.positionCount += 1;
      }

      channelMap.set(channel, existing);
    });

    // Convert to array and calculate averages
    const channels: ChannelStats[] = Array.from(channelMap.entries())
      .map(([channel, stats]) => ({
        channel,
        videoCount: stats.count,
        totalDuration: stats.totalDuration,
        avgDuration: stats.count > 0 ? Math.round(stats.totalDuration / stats.count) : 0,
        avgPosition: stats.positionCount > 0
          ? Math.round((stats.totalPosition / stats.positionCount) * 10) / 10
          : 0,
      }))
      .sort((a, b) => b.videoCount - a.videoCount) // Sort by video count descending
      .slice(0, 10); // Top 10 channels

    // Calculate summary
    const totalVideos = videoItems.length;
    const totalChannels = channelMap.size;
    const totalWatchTime = channels.reduce((sum, c) => sum + c.totalDuration, 0);

    const response: TopChannelsResponse = {
      channels,
      summary: {
        totalVideos,
        totalChannels,
        totalWatchTime,
      },
    };

    return {
      status: 200,
      jsonBody: response,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error: any) {
    const errorMessage = error?.message || String(error) || "Unknown error";
    const errorStack = error?.stack || "";
    context.error("Error getting top channels:", errorMessage, errorStack);
    return {
      status: 500,
      jsonBody: {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}

// OPTIONS handler for CORS preflight
async function getTopChannelsHttpOptions(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
}

// Wrapper handler
async function getTopChannelsHttpHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log("getTopChannelsHttpHandler called, method:", req.method);
    if (req.method === "OPTIONS") {
      context.log("Handling OPTIONS request");
      return await getTopChannelsHttpOptions(req, context);
    }
    context.log("Calling getTopChannelsHttp function");
    const result = await getTopChannelsHttp(req, context);
    context.log("getTopChannelsHttp returned successfully");
    return result;
  } catch (handlerErr: any) {
    context.error("getTopChannelsHttpHandler error:", handlerErr?.message || String(handlerErr));
    context.error("Handler error stack:", handlerErr?.stack || "");
    return {
      status: 500,
      jsonBody: {
        error: handlerErr?.message || "Handler error",
        stack: handlerErr?.stack
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}

// Function registration
app.http("GetTopChannelsHttp", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: getTopChannelsHttpHandler,
});
