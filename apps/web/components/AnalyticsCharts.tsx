"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoffStats } from "@/lib/client";
import TopChannelsWidget from "@/components/TopChannelsWidget";
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Cell,
} from "recharts";

interface AnalyticsChartsProps {
  stats: LayoffStats;
}

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#3b82f6", // blue
  "#f97316", // orange
  "#14b8a6", // teal
  "#ef4444", // red
  "#a855f7", // violet
];

export default function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const { summary, byWeek, bySector, topCompanies } = stats;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format week labels to show "Week of MM/DD"
  const weeklyData = byWeek.map((item) => {
    // Parse ISO week format (e.g., "2024-W46")
    const [year, weekNum] = item.week.split('-W');

    // Calculate the date of the Monday of that week
    const jan4 = new Date(parseInt(year), 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (parseInt(weekNum) - 1) * 7);

    // Format as "Week of M/D"
    const month = monday.getMonth() + 1;
    const day = monday.getDate();

    return {
      ...item,
      weekLabel: `Week of ${month}/${day}`,
    };
  });

  // Show only top 5 companies
  const displayedCompanies = topCompanies.slice(0, 5);

  // Handle sector bar click - navigate to archive with sector filter and 30-day range (matches analytics timeframe)
  const handleSectorClick = (sector: string) => {
    router.push(`/archive?sector=${encodeURIComponent(sector)}&days=30`);
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Layoff News This Week
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.totalArticlesThisWeek}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            articles published
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Trend
          </div>
          <div className={`text-3xl font-bold ${
            summary.percentChange > 0 ? "text-red-600 dark:text-red-400" :
            summary.percentChange < 0 ? "text-green-600 dark:text-green-400" :
            "text-gray-900 dark:text-gray-100"
          }`}>
            {summary.percentChange > 0 ? "+" : ""}{summary.percentChange}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            vs last week
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Top Sector
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {summary.topSector}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            most mentioned
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Today
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.todayCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            articles published
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Weekly Layoff News Volume
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Number of layoff-related articles published each week
        </p>
        <div className="h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis
                  dataKey="weekLabel"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  stroke="#d1d5db"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  stroke="#d1d5db"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '12px',
                  }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  fill="url(#colorArticles)"
                  stroke="none"
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Articles"
                  dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff', fill: '#6366f1' }}
                  animationDuration={1000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              Loading chart...
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout for Sector and Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Distribution */}
        {bySector.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              By Sector
            </h2>
            <div className="h-80">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bySector}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis
                      dataKey="sector"
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      stroke="#d1d5db"
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      stroke="#d1d5db"
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        padding: '12px',
                      }}
                      cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    />
                    <Bar
                      dataKey="count"
                      name="Articles"
                      onClick={(data: any) => {
                        if (data?.payload?.sector) {
                          handleSectorClick(data.payload.sector);
                        }
                      }}
                      cursor="pointer"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    >
                      {bySector.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Loading chart...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Companies */}
        {displayedCompanies.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Top Companies Mentioned
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              News mentions in last 30 days
            </p>
            <div className="space-y-4">
              {displayedCompanies.map((company, index) => (
                <Link
                  key={company.company}
                  href={`/archive?days=30&search=${encodeURIComponent(company.company)}&category=Layoffs&filter=news`}
                  className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 -mx-3 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {company.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {company.count} mention{company.count > 1 ? 's' : ''}
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(company.count / displayedCompanies[0].count) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top YouTube Channels Widget */}
      <TopChannelsWidget />

      {/* Empty States */}
      {bySector.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            No sector data available yet. Sector tagging is being implemented.
          </div>
        </div>
      )}
    </div>
  );
}
