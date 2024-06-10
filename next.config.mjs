/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
