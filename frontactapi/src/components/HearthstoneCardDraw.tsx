'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// --- Interfaces ---
interface HearthstoneCard {
  cardId?: string;
  name: string;
  cost?: number;
  attack?: number;
  health?: number;
  type?: string;
  rarity?: string;
  set?: string;
  playerClass?: string;
  text?: string;
  flavor?: string;
  artist?: string;
  img?: string;
  imgGold?: string;
}

interface HearthstoneApiResponse {
  success: boolean;
  card?: HearthstoneCard;
  cards?: HearthstoneCard[];
  message?: string;
  data?: unknown;
}

type TabType = 'draw' | 'gallery';

export default function HearthstoneCardDraw() {
  const [activeTab, setActiveTab] = useState<TabType>('draw');
  const [card, setCard] = useState<HearthstoneCard | null>(null);
  const [allCards, setAllCards] = useState<HearthstoneCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const loadAllCards = useCallback(async () => {
    setIsLoadingGallery(true);
    setError(null);

    try {
      // Cambio: Usamos la URL dinámica de producción
      const response = await fetch(`${API_BASE_URL}/api/hearthstone-draw/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: HearthstoneApiResponse = await response.json();

      if (data.cards && data.cards.length > 0) {
        setAllCards(data.cards);
      } else {
        throw new Error('No se encontraron cartas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cartas');
    } finally {
      setIsLoadingGallery(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (activeTab === 'gallery' && allCards.length === 0) {
      loadAllCards();
    }
  }, [activeTab, allCards.length, loadAllCards]);

  const drawCard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cambio: Usamos la URL dinámica de producción
      const response = await fetch(`${API_BASE_URL}/api/hearthstone-draw`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

      const data: HearthstoneApiResponse = await response.json();

      if (data.success && data.card) {
        setCard(data.card);
      } else if (data.cards && data.cards.length > 0) {
        setCard(data.cards[0]);
      } else if (data.data) {
        setCard(data.data as HearthstoneCard);
      } else {
        throw new Error(data.message || 'No se pudo obtener la carta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'border-amber-500/60 bg-gradient-to-br from-amber-900/40 to-yellow-900/30 shadow-amber-700/40';
      case 'epic': return 'border-purple-500/60 bg-gradient-to-br from-purple-900/40 to-purple-800/30 shadow-purple-700/40';
      case 'rare': return 'border-blue-500/60 bg-gradient-to-br from-blue-900/40 to-blue-800/30 shadow-blue-700/40';
      default: return 'border-stone-600/60 bg-gradient-to-br from-stone-800/40 to-stone-700/30 shadow-stone-700/40';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950">
      <header className="sticky top-0 z-50 border-b border-amber-600/30 bg-stone-950/95 backdrop-blur-xl shadow-lg shadow-amber-900/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                HEARTHSTONE API
              </h1>
              <p className="text-sm text-amber-600 italic">Explorador de Cartas en Producción</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-700/40 bg-stone-900/70 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-stone-400">Endpoint Activo</span>
            </div>
          </div>

          <nav className="mt-4 flex gap-2">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
                activeTab === 'draw'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg'
                  : 'bg-stone-800/50 text-stone-400 hover:text-white'
              }`}
            >
              Robar Carta
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg'
                  : 'bg-stone-800/50 text-stone-400 hover:text-white'
              }`}
            >
              Ver Todas ({allCards.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-700/60 bg-red-950/70 p-4 shadow-lg">
            <p className="text-sm text-red-300"><b>Error de Conexión:</b> {error}</p>
          </div>
        )}

        {/* --- Lógica de renderizado de cartas (Draw / Gallery) similar a tu código original --- */}
        {activeTab === 'draw' && (
           <div className="space-y-8">
             <div className="flex justify-center">
               <button onClick={drawCard} disabled={isLoading} className="rounded-xl bg-amber-600 px-12 py-4 font-black text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                 {isLoading ? 'ROBANDO...' : 'ROBAR CARTA'}
               </button>
             </div>
             {card && (
               <div className={`mx-auto max-w-2xl rounded-3xl border-2 p-8 ${getRarityColor(card.rarity)} bg-stone-950/90 shadow-2xl text-center`}>
                  {card.img && <img src={card.img} alt={card.name} className="mx-auto w-72 mb-4" />}
                  <h2 className="text-3xl font-bold text-amber-500 mb-4">{card.name}</h2>
                  <div className="flex justify-center gap-4 text-white font-bold">
                    <span className="bg-blue-900 px-4 py-2 rounded-lg">Mana: {card.cost}</span>
                    <span className="bg-red-900 px-4 py-2 rounded-lg">Atk: {card.attack}</span>
                    <span className="bg-green-900 px-4 py-2 rounded-lg">Vida: {card.health}</span>
                  </div>
               </div>
             )}
           </div>
        )}
      </main>

      <footer className="border-t border-amber-700/30 bg-stone-950/70 py-6 text-center">
        <p className="text-xs text-stone-600 italic">Conectado a: {API_BASE_URL}</p>
      </footer>
    </div>
  );
}