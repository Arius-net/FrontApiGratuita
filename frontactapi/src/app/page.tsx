'use client';

import { useState } from 'react';

// ============================================
// TypeScript Interfaces
// ============================================
interface ApiResponse {
  success: boolean;
  drawnCard: {
    value: string;
    suit: string;
  };
  hearthstoneCard: {
    id: number;
    name: string;
    manaCost: number;
    image: string;
    rarityId: number;
  };
  error?: string;
}

// ============================================
// Main Component
// ============================================
export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ============================================
  // Fetch Handler
  // ============================================
  const fetchCards = async () => {
    setIsLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/draw-hearthstone');
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido en la respuesta');
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mb-4 tracking-tight">
            🎴 Hearthstone Card Draw
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Invoca una carta del mazo tradicional y descubre su equivalente en Azeroth
          </p>
          
          <button
            onClick={fetchCards}
            disabled={isLoading}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg
              transition-all duration-300 transform
              ${isLoading 
                ? 'bg-slate-700 text-slate-400 cursor-wait opacity-70' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50'
              }
              disabled:cursor-not-allowed
              shadow-lg
            `}
          >
            {isLoading ? '🔮 Consultando los astros de Azeroth...' : '✨ Robar Carta'}
          </button>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 h-96 border border-slate-700">
              <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 h-96 border border-slate-700">
              <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-slate-700 rounded mt-4"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/30 backdrop-blur-sm border-2 border-red-500 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Error en la Invocación</h3>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={fetchCards}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Success State - Cards Display */}
        {data && !isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Drawn Card (Deck of Cards) */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🃏</span>
                <h2 className="text-3xl font-bold text-amber-400">Carta Tradicional</h2>
              </div>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-center gap-4 text-center">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Valor</p>
                    <p className="text-5xl font-bold text-white">{data.drawnCard.value}</p>
                  </div>
                  
                  <div className="h-20 w-px bg-slate-700"></div>
                  
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Palo</p>
                    <p className="text-3xl font-semibold text-amber-300 capitalize">{data.drawnCard.suit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hearthstone Card */}
            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🎮</span>
                <h2 className="text-3xl font-bold text-purple-300">Carta Hearthstone</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-purple-950/50 rounded-lg p-4 border border-purple-800">
                  <div>
                    <p className="text-purple-300 text-sm uppercase tracking-wider mb-1">Nombre</p>
                    <p className="text-xl font-bold text-white">{data.hearthstoneCard.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-300 text-sm uppercase tracking-wider mb-1">Maná</p>
                    <div className="bg-blue-600 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      {data.hearthstoneCard.manaCost}
                    </div>
                  </div>
                </div>

                {/* Card Image */}
                {data.hearthstoneCard.image ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-purple-700 hover:border-purple-500 transition-colors">
                    <img 
                      src={data.hearthstoneCard.image} 
                      alt={data.hearthstoneCard.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden bg-slate-900/90 p-12 text-center">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-slate-400 text-lg">Imagen no disponible</p>
                      <p className="text-white font-semibold text-xl mt-2">{data.hearthstoneCard.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/90 rounded-xl p-12 text-center border-2 border-dashed border-slate-700">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-slate-400 text-lg">Imagen no disponible</p>
                    <p className="text-white font-semibold text-xl mt-2">{data.hearthstoneCard.name}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-purple-300 bg-purple-950/30 rounded-lg p-3 border border-purple-800/50">
                  <span>ID: {data.hearthstoneCard.id}</span>
                  <span>Rareza: {data.hearthstoneCard.rarityId}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Initial State */}
        {!data && !isLoading && !error && (
          <div className="text-center text-slate-400 py-20">
            <div className="text-8xl mb-6">🎴</div>
            <p className="text-xl">Haz clic en "Robar Carta" para comenzar la experiencia</p>
          </div>
        )}

      </div>
    </div>
  );
}
