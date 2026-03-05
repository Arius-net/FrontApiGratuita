'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
  const [apiPort, setApiPort] = useState<string>('3001');

  const loadAllCards = useCallback(async () => {
    setIsLoadingGallery(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:${apiPort}/api/hearthstone-draw/all`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

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
  }, [apiPort]);

  useEffect(() => {
    if (activeTab === 'gallery' && allCards.length === 0) {
      loadAllCards();
    }
  }, [activeTab, allCards.length, loadAllCards]);

  const drawCard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:${apiPort}/api/hearthstone-draw`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

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
      case 'legendary':
        return 'border-amber-500/60 bg-linear-to-br from-amber-900/40 to-yellow-900/30 shadow-amber-700/40';
      case 'epic':
        return 'border-purple-500/60 bg-linear-to-br from-purple-900/40 to-purple-800/30 shadow-purple-700/40';
      case 'rare':
        return 'border-blue-500/60 bg-linear-to-br from-blue-900/40 to-blue-800/30 shadow-blue-700/40';
      default:
        return 'border-stone-600/60 bg-linear-to-br from-stone-800/40 to-stone-700/30 shadow-stone-700/40';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-900 via-amber-950 to-stone-950">
      <header className="sticky top-0 z-50 border-b border-amber-600/30 bg-stone-950/95 backdrop-blur-xl shadow-lg shadow-amber-900/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="bg-linear-to-r from-amber-500 via-yellow-600 to-amber-700 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                HEARTHSTONE API
              </h1>
              <p className="text-sm text-amber-600">
                Explorador de Cartas Interactivo
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-700/40 bg-stone-900/70 px-4 py-2 backdrop-blur-sm shadow-inner">
              <svg
                className="h-4 w-4 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs font-medium text-stone-400">Puerto:</span>
              <input
                type="text"
                value={apiPort}
                onChange={(e) => setApiPort(e.target.value)}
                className="w-16 rounded-lg border border-amber-700/40 bg-stone-800 px-2 py-1 text-sm font-mono text-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>
          </div>

          <nav className="mt-4 flex gap-2">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
                activeTab === 'draw'
                  ? 'bg-linear-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-700/50'
                  : 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              Robar Carta
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-linear-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-700/50'
                  : 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              Ver Todas ({allCards.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 animate-pulse rounded-xl border border-red-700/60 bg-red-950/70 p-4 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-red-400">Error</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {activeTab === 'draw' && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <button
                onClick={drawCard}
                disabled={isLoading}
                className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 p-1 shadow-2xl shadow-amber-700/60 transition-all hover:scale-105 hover:shadow-amber-700/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative rounded-xl bg-stone-950 px-12 py-6">
                  <span className="relative z-10 flex items-center gap-3 text-2xl font-black text-transparent bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text">
                    {isLoading ? (
                      <>
                        <svg
                          className="h-8 w-8 animate-spin text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Robando...
                      </>
                    ) : (
                      <>
                        ROBAR CARTA
                      </>
                    )}
                  </span>
                </div>
              </button>
            </div>

            {isLoading ? (
              <div className="mx-auto max-w-2xl">
                <div className="animate-pulse rounded-3xl border border-amber-700/40 bg-linear-to-br from-stone-900/60 to-amber-950/30 p-8 backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-80 w-56 rounded-2xl bg-stone-800/60 shadow-2xl"></div>
                    <div className="h-6 w-48 rounded-full bg-stone-800/60"></div>
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-xl bg-stone-800/60"></div>
                      <div className="h-16 w-16 rounded-xl bg-stone-800/60"></div>
                      <div className="h-16 w-16 rounded-xl bg-stone-800/60"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : card ? (
              <div className="mx-auto max-w-2xl animate-fade-in">
                <div
                  className={`rounded-3xl border-2 p-1 ${getRarityColor(card.rarity)} backdrop-blur-xl shadow-2xl`}
                >
                  <div className="rounded-2xl bg-stone-950/90 p-8">
                    {card.img && (
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 animate-pulse rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 blur-xl opacity-40"></div>
                          <Image
                            src={card.img}
                            alt={card.name}
                            width={300}
                            height={420}
                            className="relative h-auto w-72 rounded-2xl shadow-2xl"
                          />
                        </div>
                      </div>
                    )}

                    <h2 className="mb-6 text-center text-4xl font-black text-transparent bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text">
                      {card.name}
                    </h2>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      {card.cost !== undefined && (
                        <div className="rounded-2xl border border-blue-600/50 bg-linear-to-br from-blue-900/60 to-cyan-950/40 p-4 text-center backdrop-blur-sm shadow-lg">
                          <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
                            Mana
                          </p>
                          <p className="text-4xl font-black text-blue-300">
                            {card.cost}
                          </p>
                        </div>
                      )}
                      {card.attack !== undefined && (
                        <div className="rounded-2xl border border-red-600/50 bg-linear-to-br from-red-900/60 to-orange-950/40 p-4 text-center backdrop-blur-sm shadow-lg">
                          <p className="text-xs font-bold uppercase tracking-wide text-orange-400">
                            Ataque
                          </p>
                          <p className="text-4xl font-black text-orange-300">
                            {card.attack}
                          </p>
                        </div>
                      )}
                      {card.health !== undefined && (
                        <div className="rounded-2xl border border-emerald-600/50 bg-linear-to-br from-emerald-900/60 to-green-950/40 p-4 text-center backdrop-blur-sm shadow-lg">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                            Vida
                          </p>
                          <p className="text-4xl font-black text-emerald-300">
                            {card.health}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {card.type && (
                        <div className="flex items-center justify-between rounded-xl border border-amber-700/30 bg-stone-900/60 px-4 py-3 shadow-inner">
                          <span className="font-bold text-amber-500">Tipo</span>
                          <span className="font-semibold text-white">{card.type}</span>
                        </div>
                      )}
                      {card.rarity && (
                        <div className="flex items-center justify-between rounded-xl border border-amber-700/30 bg-stone-900/60 px-4 py-3 shadow-inner">
                          <span className="font-bold text-amber-500">Rareza</span>
                          <span className="font-semibold text-white">{card.rarity}</span>
                        </div>
                      )}
                      {card.playerClass && (
                        <div className="flex items-center justify-between rounded-xl border border-amber-700/30 bg-stone-900/60 px-4 py-3 shadow-inner">
                          <span className="font-bold text-amber-500">Clase</span>
                          <span className="font-semibold text-white">{card.playerClass}</span>
                        </div>
                      )}
                    </div>

                    {card.text && (
                      <div className="mt-6 rounded-xl border border-amber-600/40 bg-linear-to-br from-amber-950/30 to-orange-950/20 p-4 backdrop-blur-sm shadow-inner">
                        <p className="text-center font-medium text-amber-100">
                          {card.text.replace(/<[^>]*>/g, '')}
                        </p>
                      </div>
                    )}

                    {card.flavor && (
                      <div className="mt-4 border-t border-stone-800 pt-4">
                        <p className="text-center text-sm italic text-stone-500">
                          &ldquo;{card.flavor}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-md text-center">
                <div className="rounded-3xl border border-amber-700/40 bg-stone-900/40 p-12 backdrop-blur-xl shadow-xl">
                  <div className="mb-4 text-7xl text-amber-600">⟐</div>
                  <h3 className="mb-2 text-2xl font-bold text-amber-500">
                    Mazo Listo
                  </h3>
                  <p className="text-stone-400">
                    Haz clic en el botón para robar tu primera carta
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Colección Completa
              </h2>
              <button
                onClick={loadAllCards}
                disabled={isLoadingGallery}
                className="rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white transition-all hover:bg-amber-800 disabled:opacity-50 shadow-lg"
              >
                {isLoadingGallery ? 'Cargando...' : 'Recargar'}
              </button>
            </div>

            {isLoadingGallery ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-stone-700 bg-stone-800/60 p-4"
                  >
                    <div className="mb-3 h-48 rounded-lg bg-stone-700/60"></div>
                    <div className="h-4 rounded bg-stone-700/60"></div>
                  </div>
                ))}
              </div>
            ) : allCards.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allCards.map((cardItem, index) => (
                  <div
                    key={cardItem.cardId || index}
                    className={`group cursor-pointer rounded-2xl border-2 p-1 transition-all hover:scale-105 ${getRarityColor(cardItem.rarity)}`}
                  >
                    <div className="rounded-xl bg-stone-950/90 p-4">
                      {cardItem.img && (
                        <div className="mb-3 overflow-hidden rounded-lg">
                          <Image
                            src={cardItem.img}
                            alt={cardItem.name}
                            width={200}
                            height={280}
                            className="h-auto w-full transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                      <h3 className="mb-2 text-center font-bold text-white">
                        {cardItem.name}
                      </h3>
                      {cardItem.rarity && (
                        <p className="text-center text-xs font-semibold uppercase tracking-wide text-amber-500">
                          {cardItem.rarity}
                        </p>
                      )}
                      <div className="mt-3 flex justify-center gap-2">
                        {cardItem.cost !== undefined && (
                          <span className="rounded-full bg-blue-900/60 px-2 py-1 text-xs font-bold text-blue-300">
                            {cardItem.cost}
                          </span>
                        )}
                        {cardItem.attack !== undefined && (
                          <span className="rounded-full bg-red-900/60 px-2 py-1 text-xs font-bold text-orange-300">
                            {cardItem.attack}
                          </span>
                        )}
                        {cardItem.health !== undefined && (
                          <span className="rounded-full bg-emerald-900/60 px-2 py-1 text-xs font-bold text-emerald-300">
                            {cardItem.health}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-700 bg-stone-900/40 p-12 text-center backdrop-blur-xl shadow-xl">
                <div className="mb-4 text-6xl text-amber-700">⊞</div>
                <h3 className="mb-2 text-xl font-bold text-stone-300">
                  Sin Cartas
                </h3>
                <p className="text-stone-500">
                  Haz clic en &ldquo;Recargar&rdquo; para ver la colección
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-amber-700/30 bg-stone-950/70 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-stone-600">
            API Endpoint:{' '}
            <code className="rounded bg-stone-900 px-2 py-1 text-amber-600">
              http://localhost:{apiPort}/api/hearthstone-draw
            </code>
          </p>
        </div>
      </footer>
    </div>
  );
}
