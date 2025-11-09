"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TypeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 ml-auto">
      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Filter:</span>
      <button
        onClick={() => handleFilterChange("all")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentFilter === "all"
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleFilterChange("news")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentFilter === "news"
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        }`}
      >
        📰 News
      </button>
      <button
        onClick={() => handleFilterChange("video")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentFilter === "video"
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
        }`}
      >
        🎥 Video
      </button>
    </div>
  );
}

