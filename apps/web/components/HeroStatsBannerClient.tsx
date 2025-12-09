"use client";

import { useEffect, useState } from "react";
import { fetchLayoffStats, fetchItems } from "@/lib/client";

interface ExtraMetrics {
  mostActiveDay: string | null;
  mostActiveDayCount: number;
  newsCount: number;
  videoCount: number;
  companiesTracked: number;
  topSources: Array<{ source: string; count: number }>;
}

export default function HeroStatsBannerClient() {
  const [stats, setStats] = useState<any>(null);
  const [extraMetrics, setExtraMetrics] = useState<ExtraMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchLayoffStats(30),
      fetchItems({ days: 7 }) // Get last 7 days for pulse metrics
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

        // Count unique companies tracked
        const uniqueCompanies = new Set<string>();
        layoffItems.forEach((item: any) => {
          if (item.companyName) {
            uniqueCompanies.add(item.companyName);
          }
        });

        // Count by source (news only, exclude YouTube)
        const sourceCount: Record<string, number> = {};
        layoffItems.forEach((item: any) => {
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
          companiesTracked: uniqueCompanies.size,
          topSources
        });
      })
      .catch((error) => {
        console.warn('Failed to fetch stats:', error);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // If stats failed to load or still loading, don't show the banner
  if (loading || !stats) {
    return null;
  }

  const { summary } = stats;
  const trendDirection = summary.percentChange > 0 ? "up" : summary.percentChange < 0 ? "down" : "neutral";
  const trendColor =
    trendDirection === "up" ? "text-red-600 dark:text-red-400" :
    trendDirection === "down" ? "text-green-600 dark:text-green-400" :
    "text-gray-600 dark:text-gray-400";

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
        {/* Main Title */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Layoff News Tracker
          </h2>
          <p className="text-indigo-100 dark:text-indigo-200 text-sm md:text-base">
            Real-time insights into layoff announcements and trends
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full md:w-auto">
          {/* This Week */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold mb-1">
              {summary.totalArticlesThisWeek}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Stories This Week
            </div>
          </div>

          {/* Trend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className={`text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center gap-1 ${trendColor}`}>
              {trendDirection === "up" && (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
              {trendDirection === "down" && (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {Math.abs(summary.percentChange)}%
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              vs Last Week
            </div>
          </div>

          {/* Top Sector */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 truncate">
              {summary.topSector}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Top Sector
            </div>
          </div>

          {/* Today */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold mb-1">
              {summary.todayCount}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Today
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Pulse Metrics - Compact Row */}
      {extraMetrics && (
        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center justify-center gap-6 md:gap-8 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-indigo-200">📊 Last 7 Days:</span>
            </div>
            {extraMetrics.mostActiveDay && (
              <div className="flex items-center gap-2">
                <span className="text-indigo-200">Most active day:</span>
                <span className="font-semibold">{extraMetrics.mostActiveDay} ({extraMetrics.mostActiveDayCount})</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-indigo-200">Content mix:</span>
              <span className="font-semibold">News {extraMetrics.newsCount} | Videos {extraMetrics.videoCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-200">Companies tracked:</span>
              <span className="font-semibold">{extraMetrics.companiesTracked}</span>
            </div>
            {extraMetrics.topSources.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-indigo-200">Top sources:</span>
                <span className="font-semibold">
                  {extraMetrics.topSources.map((s, i) => `${i + 1}. ${s.source}`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
