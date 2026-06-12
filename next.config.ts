import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.jobtrustcheck.com",
          },
        ],
        destination: "https://jobtrustcheck.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
