import { Suspense } from "react";
import ArchivePageClient from "@/components/ArchivePageClient";

// Fully client-side rendered to eliminate all hydration mismatches
export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-500 dark:text-gray-400">Loading...</div></div>}>
      <ArchivePageClient />
    </Suspense>
  );
}
