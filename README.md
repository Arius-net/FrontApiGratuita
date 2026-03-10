# FrontApiGratuita

Frontend para consumir la API gratuita de Hearthstone desplegada en Vercel.

## 🚀 API Backend

La API está desplegada en: **https://act6-api-gratuita.vercel.app**

## 📦 Tecnologías

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **React 19** - Biblioteca de UI

## 🛠️ Configuración Local

### 1. Instalación

```bash
cd frontactapi
npm install
```

### 2. Configuración de Variables de Entorno

El archivo `.env.local` ya está configurado con:

```env
NEXT_PUBLIC_API_BASE_URL=https://act6-api-gratuita.vercel.app/api
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Vercel

Para desplegar este frontend en Vercel, consulta las instrucciones detalladas en:

📄 **[DEPLOYMENT.md](frontactapi/DEPLOYMENT.md)**

### Resumen rápido:

1. Conecta tu repositorio en Vercel
2. Configura la variable de entorno:
   - `NEXT_PUBLIC_API_BASE_URL=https://act6-api-gratuita.vercel.app/api`
3. Deploy

## 📁 Estructura del Proyecto

```
frontactapi/
├── src/
│   ├── app/              # App Router de Next.js
│   ├── components/       # Componentes React
│   ├── services/         # Servicios para llamadas API
│   └── types/            # Tipos de TypeScript
├── .env.local            # Variables de entorno (desarrollo)
├── .env.production       # Variables de entorno (producción)
└── next.config.ts        # Configuración de Next.js
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📝 Notas

- Este proyecto consume la API de Hearthstone desplegada en Vercel
- Las variables de entorno con prefijo `NEXT_PUBLIC_` son accesibles en el cliente
- El proyecto usa el App Router de Next.js (no Pages Router)