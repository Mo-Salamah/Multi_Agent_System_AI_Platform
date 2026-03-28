import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/Multi_Agent_System_AI_Platform" : "",
  images: { unoptimized: true },
};

export default nextConfig;
