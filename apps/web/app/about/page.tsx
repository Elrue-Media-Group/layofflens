import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">About</li>
        </ol>
      </nav>

      {/* Page Content */}
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          About LayoffLens
        </h1>

        {/* About the Site Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What is LayoffLens?
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              LayoffLens is your comprehensive resource for tracking layoffs, job market trends, and career insights across industries. We automatically aggregate the latest news, analysis, and helpful resources to keep you informed about the evolving employment landscape.
            </p>
            <p>
              Our platform continuously monitors trusted sources to bring you:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Real-time layoff news</strong> from major tech companies and across all sectors</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Expert analysis and commentary</strong> on market trends and unemployment data</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Career resources</strong> including resume tips, interview guidance, and job search strategies</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Video content</strong> from industry experts and career coaches on YouTube</span>
              </li>
            </ul>
            <p>
              Whether you're navigating a career transition, staying informed about your industry, or researching job market conditions, LayoffLens provides the insights you need to make informed decisions about your career.
            </p>
          </div>
        </div>

        {/* About Elrue Media Group */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src="https://d3tbaba9xfyjnl.cloudfront.net/elruemediagroup-logoHD.png"
              alt="Elrue Media Group"
              className="w-48 h-48 rounded-lg object-contain"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Built by Elrue Media Group
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  LayoffLens is developed and maintained by <a href="https://elruemediagroup.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Elrue Media Group</a>, a technology studio focused on building practical, data-driven web applications that help people stay informed and make better decisions.
                </p>
                <p>
                  Elrue Media Group specializes in cloud-native development, AI-powered automation, and modern full-stack applications. LayoffLens is one of several projects built under the Elrue umbrella, combining real-time data aggregation with intelligent analysis to deliver timely insights on the job market.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Technology Stack
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            LayoffLens is built with modern cloud technologies and hosted entirely on Microsoft Azure:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Next.js 15</strong> - React framework for the web application</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Static Web Apps</strong> - Hosting with built-in CDN and SSL</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Functions</strong> - Serverless API endpoints and scheduled jobs</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Table Storage</strong> - NoSQL database for feed items</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Blob Storage</strong> - Image and asset hosting</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>GitHub Actions</strong> - CI/CD pipeline for automated deployments</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
