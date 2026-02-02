import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise les requêtes cross-origin en dev (IDE WebView / réseau local)
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.32:3000",
  ],
};

export default nextConfig;
