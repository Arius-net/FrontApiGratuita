import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar modo standalone para Docker (reduce el tamaño de la imagen)
  output: "standalone",
  
  // Variables de entorno públicas disponibles en el cliente
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://act6-api-gratuita-8nz5.vercel.app/api",
  },
  
  async headers() {
    // Obtener orígenes permitidos desde variables de entorno
    // En producción, esto debería ser tu dominio de frontend desplegado
    const allowedOrigins = process.env.ALLOWED_ORIGINS || "*";
    
    return [
      {
        // Aplicar CORS a todas las rutas API (si tienes API routes en Next.js)
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
