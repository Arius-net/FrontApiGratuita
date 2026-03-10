// Script para verificar la conexión con la API
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://act6-api-gratuita.vercel.app/api';

async function testAPIConnection() {
  console.log('🔍 Verificando conexión con la API...');
  console.log(`📡 URL: ${API_URL}\n`);

  try {
    // Test endpoint de salud o cartas
    const response = await fetch(`${API_URL}/hearthstone/cards?pageSize=1`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Conexión exitosa con la API');
    console.log('📊 Respuesta recibida:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n✨ Todo está funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error al conectar con la API:');
    console.error(error.message);
    console.log('\n🔧 Verifica:');
    console.log('  1. Que la API esté desplegada y activa');
    console.log('  2. Que la variable NEXT_PUBLIC_API_BASE_URL esté correcta');
    console.log('  3. Que no haya problemas de CORS');
    process.exit(1);
  }
}

testAPIConnection();
