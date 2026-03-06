'use client';

import { useState } from 'react';
import CardsList from '@/components/CardsList';
import DeckManager from '@/components/DeckManager';

type TabType = 'cards' | 'decks';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #1a0f08 0%, #2c1810 50%, #1a0f08 100%)'
    }}>
      {/* Textura de piedra de fondo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        backgroundSize: '4px 4px'
      }} />

      {/* Luces de velas ambiente */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-20 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute top-64 left-20 w-64 h-64 bg-orange-700/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-40 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header estilo taberna */}
      <header className="sticky top-0 z-50 wood-panel shadow-2xl border-b-4 border-[#6b402e]">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          {/* Logo y branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg gold-border gold-gradient flex items-center justify-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                <span className="text-2xl font-black text-[#2c1810] relative z-10">HS</span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-wider" style={{
                  color: '#d4af37',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.3)'
                }}>
                  HEARTHSTONE TAVERN
                </h1>
                <p className="text-sm text-[#e8d5b7] font-serif tracking-wide">
                  DECK BUILDER & COLLECTION
                </p>
              </div>
            </div>

            {/* Badge de mazo actual */}
            {currentDeckId && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg wood-panel border-2 border-[#d4af37] animate-slide-down">
                <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-glow"></div>
                <span className="text-sm font-bold text-[#d4af37]">
                  Mazo Activo
                </span>
              </div>
            )}
          </div>

          {/* Navegación estilo letreros de taberna */}
          <nav className="flex gap-3 p-2 stone-texture rounded-lg">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex-1 px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === 'cards'
                  ? 'btn-tavern text-[#2c1810]'
                  : 'wood-panel text-[#e8d5b7] hover:text-[#d4af37] border-2 border-[#6b402e]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                EXPLORAR CARTAS
              </span>
            </button>
            <button
              onClick={() => setActiveTab('decks')}
              className={`flex-1 px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === 'decks'
                  ? 'btn-tavern text-[#2c1810]'
                  : 'wood-panel text-[#e8d5b7] hover:text-[#d4af37] border-2 border-[#6b402e]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                MIS MAZOS
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 container mx-auto px-4 lg:px-8 py-8 animate-fade-in">
        {activeTab === 'cards' && (
          <CardsList currentDeckId={currentDeckId} />
        )}
        {activeTab === 'decks' && (
          <DeckManager
            currentDeckId={currentDeckId}
            onDeckSelect={setCurrentDeckId}
          />
        )}
      </main>

      {/* Footer estilo taberna */}
      <footer className="relative z-10 border-t-4 border-[#6b402e] wood-panel py-8 mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#e8d5b7] text-sm font-serif">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Powered by Blizzard API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-[#d4af37]">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost:3001'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sombras de velas en el suelo */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
      }} />
    </div>
  );
}
