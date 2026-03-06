import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar modo standalone para Docker (reduce el tamaño de la imagen)
  output: "standalone",
  
  async headers() {
    // Obtener orígenes permitidos desde variables de entorno
    const allowedOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:3001";
    
    return [
      {
        // Aplicar CORS a todas las rutas API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigins },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;
