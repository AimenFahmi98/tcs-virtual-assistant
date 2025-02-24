/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Adjust the size as needed (e.g., 10mb, 20mb)
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ssiznirqzcgkeuzesfad.supabase.co", // Supabase domain
        pathname: "/storage/v1/object/public/**", // Allow all public images
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com", // Allow DiceBear avatars
        pathname: "/**", // Allow only this specific DiceBear path
      },
    ],
    dangerouslyAllowSVG: true, // Enable external SVG support
  },
  serverExternalPackages: ["pdf-parse"], // Corrected configuration
};

export default nextConfig;
