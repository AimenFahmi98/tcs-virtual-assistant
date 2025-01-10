/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      exclude: ["sharp", "onnxruntime-node"], // Prevent bundling
    },
  },
};

export default nextConfig;
