/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      // 允许IP API的CORS请求
      {
        source: '/api/ipLookup',
        destination: '/api/ipLookup',
      },
    ]
  },
};

export default nextConfig;
