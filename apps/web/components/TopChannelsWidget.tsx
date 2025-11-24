"use client";

import { useEffect, useState } from "react";
import { fetchTopChannels, TopChannelsData } from "@/lib/client";

function secondsToReadable(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function TopChannelsWidget() {
  const [data, setData] = useState<TopChannelsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTopChannels(30)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch top channels:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Top YouTube Channels
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Top YouTube Channels
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Unable to load channel data
        </div>
      </div>
    );
  }

  const topChannels = data.channels.slice(0, 5); // Show top 5

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          Top YouTube Channels
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Most active channels covering layoffs (last 30 days)
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.summary.totalVideos}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Videos
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.summary.totalChannels}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Channels
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {secondsToReadable(data.summary.totalWatchTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Watch Time
          </div>
        </div>
      </div>

      {/* Top Channels List */}
      <div className="space-y-4">
        {topChannels.map((channel, index) => (
          <a
            key={channel.channel}
            href={`/archive?days=30&channel=${encodeURIComponent(channel.channel)}&filter=video`}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
          >
            {/* Rank Badge */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : index === 1
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  : index === 2
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              }`}
            >
              {index + 1}
            </div>

            {/* Channel Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                {channel.channel}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {channel.videoCount} videos
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {secondsToReadable(channel.avgDuration)} avg
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  #{channel.avgPosition.toFixed(1)} rank
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
