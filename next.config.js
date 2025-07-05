/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
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