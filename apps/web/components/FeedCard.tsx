"use client";

import { FeedItem } from "@/lib/client";

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const date = new Date(item.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Check if item is from today (new)
  const today = new Date();
  const isNew = date.toDateString() === today.toDateString();

  // Determine which image to use
  const getFallbackImage = () => {
    if (item.type === "video") {
      return "https://layofflens.blob.core.windows.net/layofflens/video_cover1.png";
    }
    return "https://layofflens.blob.core.windows.net/layofflens/news_cover1.png";
  };

  const hasValidImage = item.imageUrl && !item.imageUrl.includes('favicons');
  const imageToDisplay = hasValidImage ? item.imageUrl : getFallbackImage();

  return (
    <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group h-full flex flex-col">
      <div className={`w-full h-1.5 ${
        item.type === "video"
          ? "bg-gradient-to-r from-purple-500 to-pink-500"
          : "bg-gradient-to-r from-blue-500 to-indigo-500"
      }`} />
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={imageToDisplay}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If the actual image fails, use fallback
            const img = e.target as HTMLImageElement;
            if (img.src !== getFallbackImage()) {
              img.src = getFallbackImage();
            }
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {isNew && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm">
              NEW
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              item.type === "video"
                ? "bg-purple-500/80 text-white"
                : "bg-blue-500/80 text-white"
            }`}
          >
            {item.type === "video" ? "🎥 Video" : "📰 News"}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col min-w-0">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.title}
          </a>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
          {item.snippet}
        </p>
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{item.source}</span>
              <span className="text-gray-400">•</span>
              <time dateTime={item.date} className="whitespace-nowrap">{formattedDate}</time>
            </div>
            {(() => {
              const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
              return tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.slice(0, 3).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium border border-gray-200 dark:border-gray-700 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
      </div>
    </article>
  );
}

