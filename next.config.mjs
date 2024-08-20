/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Chấp nhận bất kỳ hostname nào
        port: "",
        pathname: "**", // Chấp nhận bất kỳ đường dẫn nào
      },
      {
        protocol: "http",
        hostname: "**", // Chấp nhận bất kỳ hostname nào
        port: "",
        pathname: "**", // Chấp nhận bất kỳ đường dẫn nào
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.pdf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/pdf/',
            publicPath: '/_next/static/pdf/',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
