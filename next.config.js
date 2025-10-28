/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/cheat-sheet' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cheat-sheet' : '',
};

module.exports = nextConfig;
