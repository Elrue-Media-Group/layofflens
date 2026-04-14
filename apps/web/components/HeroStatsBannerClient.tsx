"use client";

import { useEffect, useState } from "react";
import { fetchLayoffStats, fetchItems } from "@/lib/client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ExtraMetrics {
  mostActiveDay: string | null;
  mostActiveDayCount: number;
  newsCount: number;
  videoCount: number;
  companiesTracked: number;
  topSources: Array<{ source: string; count: number }>;
  dailyTrend: Array<{ day: string; count: number }>;
  sectorBreakdown: Array<{ sector: string; count: number }>;
}

export default function HeroStatsBannerClient() {
  const [stats, setStats] = useState<any>(null);
  const [extraMetrics, setExtraMetrics] = useState<ExtraMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    Promise.all([
      fetchLayoffStats(30),
      fetchItems({ days: 7 })
    ])
      .then(([statsData, itemsData]) => {
        setStats(statsData);

        const items = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);

        const layoffItems = items.filter((item: any) => {
          const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
          return item.type === 'news' && tags.includes('Layoffs');
        });

        const dayCount: Record<string, number> = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        layoffItems.forEach((item: any) => {
          const date = new Date(item.date);
          const dayName = dayNames[date.getDay()];
          dayCount[dayName] = (dayCount[dayName] || 0) + 1;
        });

        let mostActiveDay = null;
        let mostActiveDayCount = 0;
        Object.entries(dayCount).forEach(([day, count]) => {
          if (count > mostActiveDayCount) {
            mostActiveDay = day;
            mostActiveDayCount = count;
          }
        });

        const newsCount = items.filter((item: any) => item.type === 'news').length;
        const videoCount = items.filter((item: any) => item.type === 'video').length;

        const uniqueCompanies = new Set<string>();
        layoffItems.forEach((item: any) => {
          if (item.companyName) {
            uniqueCompanies.add(item.companyName);
          }
        });

        const sourceCount: Record<string, number> = {};
        layoffItems.forEach((item: any) => {
          if (item.source && item.type === 'news' && !item.source.includes('youtube.com')) {
            sourceCount[item.source] = (sourceCount[item.source] || 0) + 1;
          }
        });

        const topSources = Object.entries(sourceCount)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        const dailyTrend: Array<{ day: string; count: number }> = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
          const count = layoffItems.filter((item: any) => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            return itemDate === dateStr;
          }).length;
          dailyTrend.push({ day: dayLabel, count });
        }

        const sectorBreakdown = (statsData?.bySector || [])
          .slice(0, 5)
          .map((s: any) => ({ sector: s.sector, count: s.count }));

        setExtraMetrics({
          mostActiveDay,
          mostActiveDayCount,
          newsCount,
          videoCount,
          companiesTracked: uniqueCompanies.size,
          topSources,
          dailyTrend,
          sectorBreakdown,
        });
      })
      .catch((error) => {
        console.warn('Failed to fetch stats:', error);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return null;
  }

  const { summary } = stats;
  const trendDirection = summary.percentChange > 0 ? "up" : summary.percentChange < 0 ? "down" : "neutral";

  const SECTOR_COLORS = isDark
    ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"]
    : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const tooltipStyle = isDark
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', color: '#e5e7eb' }
    : { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#1f2937', boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)' };

  const axisColor = isDark ? '#6b7280' : '#9ca3af';
  const accentColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8">
      {/* Top row: Title + Key Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Layoff News Tracker
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Real-time insights into layoff announcements and trends
          </p>
        </div>

        {/* Key metric pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.totalArticlesThisWeek}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">this<br/>week</span>
          </div>
          <div className={`flex items-center gap-1.5 rounded-lg px-4 py-2 border ${
            trendDirection === "up"
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
              : trendDirection === "down"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
          }`}>
            {trendDirection === "up" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            )}
            {trendDirection === "down" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
              </svg>
            )}
            <span className="text-lg font-bold">{Math.abs(summary.percentChange)}%</span>
            <span className="text-xs opacity-70">vs last wk</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{summary.todayCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">today</span>
          </div>
          {summary.topSector && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">{summary.topSector}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">top sector</span>
            </div>
          )}
        </div>
      </div>

      {/* Charts row */}
      {extraMetrics && mounted && (
        <div key={isDark ? 'dark' : 'light'} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* 7-Day Trend Area Chart */}
          <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">7-Day Trend</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{extraMetrics.newsCount + extraMetrics.videoCount} items</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={extraMetrics.dailyTrend} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
                  <defs>
                    <linearGradient id="heroTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: axisColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: axisColor }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={accentColor}
                    strokeWidth={2}
                    fill="url(#heroTrendGrad)"
                    dot={{ fill: accentColor, r: 2.5, strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: accentColor, stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Breakdown Bar Chart */}
          <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">By Sector</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{extraMetrics.sectorBreakdown.length} sectors</span>
            </div>
            <div className="h-28">
              {extraMetrics.sectorBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={extraMetrics.sectorBreakdown} margin={{ top: 14, right: 2, bottom: 0, left: 2 }}>
                    <XAxis
                      dataKey="sector"
                      tick={{ fill: axisColor, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis hide />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]} label={{ position: 'top', fill: axisColor, fontSize: 10, fontWeight: 600 }}>
                      {extraMetrics.sectorBreakdown.map((_, i) => (
                        <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-xs">
                  No sector data
                </div>
              )}
            </div>
          </div>

          {/* Content Mix + Sources */}
          <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content Mix</span>
            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-300">News</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{extraMetrics.newsCount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"
                    style={{ width: `${(extraMetrics.newsCount / Math.max(extraMetrics.newsCount + extraMetrics.videoCount, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Videos</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{extraMetrics.videoCount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                    style={{ width: `${(extraMetrics.videoCount / Math.max(extraMetrics.newsCount + extraMetrics.videoCount, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/50">
                <span className="text-gray-500 dark:text-gray-400">Companies tracked</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{extraMetrics.companiesTracked}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom metadata row */}
      {extraMetrics && (
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700/50 pt-3">
          <div className="flex items-center gap-4 flex-wrap">
            {extraMetrics.mostActiveDay && (
              <span>
                Most active: <span className="text-gray-600 dark:text-gray-300">{extraMetrics.mostActiveDay} ({extraMetrics.mostActiveDayCount})</span>
              </span>
            )}
            {extraMetrics.topSources.length > 0 && (
              <span>
                Top sources: <span className="text-gray-600 dark:text-gray-300">{extraMetrics.topSources.map((s) => `${s.source}`).join(' · ')}</span>
              </span>
            )}
          </div>
          <span className="text-gray-300 dark:text-gray-600">Last 7 days</span>
        </div>
      )}
    </div>
  );
}
