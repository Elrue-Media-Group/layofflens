"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function DateRangeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentDays = searchParams.get("days");

  const handleDaysChange = (days: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (days === null) {
      // "Recent" selected - remove days param (shows most recent 500)
      params.delete("days");
    } else {
      params.set("days", days);
    }
    // Reset to page 1 when changing date range
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Date Range:</span>
      <button
        onClick={() => handleDaysChange(null)}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          !currentDays
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        Recent
      </button>
      <button
        onClick={() => handleDaysChange("10")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentDays === "10"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        10 days
      </button>
      <button
        onClick={() => handleDaysChange("20")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentDays === "20"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        20 days
      </button>
      <button
        onClick={() => handleDaysChange("30")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentDays === "30"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        30 days
      </button>
    </div>
  );
}

