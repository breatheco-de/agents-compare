/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        // Windsurf was renamed to Devin Desktop
        source: '/agent/windsurf',
        destination: '/agent/devin-desktop',
        statusCode: 301
      },
      {
        // Amazon Q Developer reached end of support; Kiro is its successor
        source: '/agent/amazon-q-developer',
        destination: '/agent/kiro',
        statusCode: 301
      },
      {
        // Claude 3/4 features were merged into claude-latest-support
        source: '/feature/claude3-support',
        destination: '/feature/claude-latest-support',
        statusCode: 301
      },
      {
        source: '/feature/claude-4-support',
        destination: '/feature/claude-latest-support',
        statusCode: 301
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/agent/:slug.json',
        destination: '/api/agents/:slug'
      },
      {
        source: '/feature/:slug.json',
        destination: '/api/features/:slug'
      },
      {
        source: '/compare/:slugs.json',
        destination: '/api/compare/:slugs'
      }
    ]
  }
}

module.exports = nextConfig 