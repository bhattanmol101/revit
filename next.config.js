/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "polsjqhrbgmnoivxcjrj.supabase.co",
            port: "",
            pathname: "/**",
          }
        ],
      },
};

module.exports = nextConfig;
