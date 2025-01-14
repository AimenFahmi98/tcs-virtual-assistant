/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Adjust the size as needed (e.g., 10mb, 20mb)
    },
  },
  serverExternalPackages: ["pdf-parse"], // Corrected configuration
};

export default nextConfig;
