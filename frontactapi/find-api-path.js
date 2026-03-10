// Script para encontrar la ruta correcta de la API
const BASE_URL = 'https://act6-api-gratuita.vercel.app';

const possiblePaths = [
  '/api/hearthstone/cards',
  '/hearthstone/cards',
  '/act6-api/hearthstone/cards',
  '/api/act6-api/hearthstone/cards',
  '/cards',
  '/api/cards',
  '/',
  '/api',
  '/health',
  '/api/health',
];

async function testPaths() {
  console.log('🔍 Buscando la ruta correcta de la API...\n');
  
  for (const path of possiblePaths) {
    const url = `${BASE_URL}${path}`;
    try {
      const response = await fetch(url);
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ENCONTRADO: ${url}`);
        const data = await response.json();
        console.log('📊 Respuesta:', JSON.stringify(data, null, 2).substring(0, 200) + '...\n');
      } else if (status !== 404) {
        console.log(`⚠️  ${status}: ${url}`);
      }
    } catch (error) {
      // Ignorar errores de red
    }
  }
  
  console.log('\n✨ Búsqueda completada');
}

testPaths();
