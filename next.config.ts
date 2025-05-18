/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // ✅ ALLOW dev origin
  allowedDevOrigins: ["http://192.168.1.9:3001"], // include the port you're using!
};

export default nextConfig;
