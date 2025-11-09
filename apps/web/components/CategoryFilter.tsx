"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface CategoryFilterProps {
  availableTags: string[];
}

export default function CategoryFilter({ availableTags }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Popular categories to show first
  const popularCategories = [
    "Resume Writing",
    "Interview Tips",
    "Layoffs",
    "AI",
    "Job Search",
    "Career Advice",
    "ATS",
    "Networking",
  ];

  // Sort available tags: popular first, then others
  const sortedTags = [
    ...popularCategories.filter((tag) => availableTags.includes(tag)),
    ...availableTags.filter((tag) => !popularCategories.includes(tag)),
  ].slice(0, 8); // Limit to 8 categories to keep it compact

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Category:</span>
      <button
        onClick={() => handleCategoryChange("all")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          currentCategory === "all"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        All
      </button>
      {sortedTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleCategoryChange(tag)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentCategory === tag
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

