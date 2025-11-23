"use client";

import { useEffect, useState } from "react";
import { fetchLayoffStats, fetchItems } from "@/lib/client";

interface LayoffStats {
  summary: {
    totalArticlesThisWeek: number;
    totalArticlesLastWeek: number;
    percentChange: number;
    topSector: string;
    todayCount: number;
  };
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
}

interface ExtraMetrics {
  mostActiveDay: string | null;
  mostActiveDayCount: number;
  newsCount: number;
  videoCount: number;
  topSources: Array<{ source: string; count: number }>;
}

export default function LayoffPulse() {
  const [stats, setStats] = useState<LayoffStats | null>(null);
  const [extraMetrics, setExtraMetrics] = useState<ExtraMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchLayoffStats(14), // Get stats for last 14 days to ensure complete week-over-week data
      fetchItems({ days: 7 }) // Get raw items to calculate extra metrics
    ])
      .then(([statsData, itemsData]) => {
        setStats(statsData);

        // Calculate extra metrics from raw items
        const items = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);

        // Filter to layoff news only
        const layoffItems = items.filter((item: any) => {
          const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
          return item.type === 'news' && tags.includes('Layoffs');
        });

        // Count by day of week
        const dayCount: Record<string, number> = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        layoffItems.forEach((item: any) => {
          const date = new Date(item.date);
          const dayName = dayNames[date.getDay()];
          dayCount[dayName] = (dayCount[dayName] || 0) + 1;
        });

        // Find most active day
        let mostActiveDay = null;
        let mostActiveDayCount = 0;
        Object.entries(dayCount).forEach(([day, count]) => {
          if (count > mostActiveDayCount) {
            mostActiveDay = day;
            mostActiveDayCount = count;
          }
        });

        // Count news vs videos (all items, not just layoffs)
        const newsCount = items.filter((item: any) => item.type === 'news').length;
        const videoCount = items.filter((item: any) => item.type === 'video').length;

        // Count by source (news only, exclude YouTube)
        const sourceCount: Record<string, number> = {};
        layoffItems.forEach((item: any) => {
          // Only count news sources, not video platforms
          if (item.source && item.type === 'news' && !item.source.includes('youtube.com')) {
            sourceCount[item.source] = (sourceCount[item.source] || 0) + 1;
          }
        });

        // Get top 3 news sources
        const topSources = Object.entries(sourceCount)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setExtraMetrics({
          mostActiveDay,
          mostActiveDayCount,
          newsCount,
          videoCount,
          topSources
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { topCompanies } = stats;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Layoff Pulse - Last 7 Days
      </h2>

      <div className="space-y-4">
        {/* Most active day */}
        {extraMetrics?.mostActiveDay && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Most active day</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {extraMetrics.mostActiveDay} ({extraMetrics.mostActiveDayCount})
            </span>
          </div>
        )}

        {/* Content type split */}
        {extraMetrics && (extraMetrics.newsCount > 0 || extraMetrics.videoCount > 0) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Content mix</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              News: {extraMetrics.newsCount} | Videos: {extraMetrics.videoCount}
            </span>
          </div>
        )}

        {/* Unique companies */}
        {topCompanies.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Companies tracked</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {topCompanies.length}
            </span>
          </div>
        )}

        {/* Top 3 news sources */}
        {extraMetrics && extraMetrics.topSources.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Top sources</span>
            <div className="space-y-1">
              {extraMetrics.topSources.map((item, index) => (
                <div key={item.source} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 dark:text-gray-300">
                    {index + 1}. {item.source}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
