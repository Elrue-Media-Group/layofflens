/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps with Next.js SSR support
  // No output mode specified - lets Next.js use default server rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Use GitHub SHA from environment (set by GitHub Actions)
  // Falls back to timestamp for local builds
  generateBuildId: async () => {
    return process.env.GITHUB_SHA || 'local-' + Date.now();
  },
};

export default nextConfig;
