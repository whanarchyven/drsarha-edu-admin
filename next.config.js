const PROXY_PATH = process.env.NEXT_PUBLIC_FRONT_API_URL;
const API_URL = process.env.NEXT_PUBLIC_FRONT_PROXY_API_URL;
/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: false,
  images: {
    unoptimized: Boolean(Number(process.env.UNOPTIMIZED_IMAGES)),
    deviceSizes: [767, 980, 1156, 1400, 1920],
    formats: ['image/webp'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: `${PROXY_PATH}/:path*`, // Захватываем маршруты с /api/proxy
        destination: `${API_URL}/:path*`, // Перенаправляем на API
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeDimensions',
                  active: true,
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};
module.exports = moduleExports;
