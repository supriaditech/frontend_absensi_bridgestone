/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost", // For localhost development
      "youtube.com", // For YouTube embeds (only domain)
      "play.google.com", // For Google Play (only domain)
    ],
  },
};

export default nextConfig;
