"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing page {currentPage} of {totalPages} ({totalItems} items)
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Previous
        </button>
        
        {getPageNumbers().map((page, idx) => (
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

