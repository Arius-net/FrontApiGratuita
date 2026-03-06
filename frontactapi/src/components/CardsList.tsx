'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { hearthstoneService, deckService } from '@/services/hearthstoneService';
import { handleApiError } from '@/services/apiClient';
import type { HearthstoneCard, SearchFilters } from '@/types/api.types';

interface CardsListProps {
  currentDeckId: string | null;
}

export default function CardsList({ currentDeckId }: CardsListProps) {
  const [cards, setCards] = useState<HearthstoneCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    manaCost: undefined,
    class: '',
    rarity: '',
  });
  const [searchActive, setSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 30;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await hearthstoneService.getAllCards();
      setCards(response.data.cards);
      setError(null);
      setSearchActive(false);
      setCurrentPage(1); // Reset a primera página
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await hearthstoneService.searchCards(filters);
      setCards(response.data.cards);
      setError(null);
      setSearchActive(true);
      setCurrentPage(1); // Reset a primera página
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDeck = async (card: HearthstoneCard) => {
    if (!currentDeckId) {
      alert('Primero selecciona o crea un mazo');
      return;
    }

    try {
      await deckService.addCardToDeck(currentDeckId, card);
      alert(`${card.name} agregada al mazo!`);
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const getRarityColor = (rarityId: number) => {
    switch (rarityId) {
      case 5: // Legendary
        return 'rarity-legendary';
      case 4: // Epic
        return 'rarity-epic';
      case 3: // Rare
        return 'rarity-rare';
      default: // Common/Free
        return 'rarity-common';
    }
  };

  const getRarityBadge = (rarityId: number) => {
    switch (rarityId) {
      case 5: return { text: 'LEGENDARY', color: 'bg-orange-500/30 text-orange-300 border-orange-400' };
      case 4: return { text: 'EPIC', color: 'bg-purple-500/30 text-purple-300 border-purple-400' };
      case 3: return { text: 'RARE', color: 'bg-blue-500/30 text-blue-300 border-blue-400' };
      default: return { text: 'COMMON', color: 'bg-stone-500/30 text-stone-400 border-stone-500' };
    }
  };

  // Paginación
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#2c1810]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#d4af37] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-[#e8d5b7] text-lg font-bold">Cargando colección...</p>
          <p className="text-[#8b6914] text-sm mt-2">Preparando las cartas de la taberna</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="wood-panel border-4 border-red-900 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 flex items-center justify-center border-2 border-red-800">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 mb-6 font-bold text-lg">{error}</p>
          <button
            onClick={fetchCards}
            className="btn-tavern text-[#2c1810] px-8 py-3 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Panel de filtros estilo pergamino */}
      <div className="wood-frame rounded-2xl p-6 lg:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gold-border gold-gradient flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#2c1810]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#d4af37] tracking-wide">BUSCAR CARTAS</h2>
            <p className="text-[#e8d5b7] text-sm font-serif">Encuentra la carta perfecta para tu mazo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Filtro de Maná */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#d4af37] uppercase tracking-wider">
              Costo de Maná
            </label>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
              value={filters.manaCost || ''}
              onChange={(e) => setFilters({ ...filters, manaCost: e.target.value ? Number(e.target.value) : undefined })}
              className="input-parchment w-full px-4 py-3.5 rounded-lg focus:outline-none transition-all font-bold"
            />
          </div>

          {/* Filtro de Clase */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#d4af37] uppercase tracking-wider">
              Clase
            </label>
            <input
              type="text"
              placeholder="mage, warrior..."
              value={filters.class || ''}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="input-parchment w-full px-4 py-3.5 rounded-lg focus:outline-none transition-all font-bold"
            />
          </div>

          {/* Filtro de Rareza */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#d4af37] uppercase tracking-wider">
              Rareza
            </label>
            <input
              type="text"
              placeholder="legendary, epic..."
              value={filters.rarity || ''}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
              className="input-parchment w-full px-4 py-3.5 rounded-lg focus:outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="btn-tavern flex-1 px-6 py-4 text-[#2c1810] rounded-xl"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              BUSCAR
            </span>
          </button>
          <button
            onClick={fetchCards}
            className="px-6 py-4 wood-panel text-[#e8d5b7] hover:text-[#d4af37] rounded-xl transition-all border-2 border-[#6b402e]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mesa de cartas */}
      <div className="wood-frame rounded-2xl p-6 lg:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-[#d4af37]">
              {searchActive ? 'RESULTADOS' : 'TODAS LAS CARTAS'}
            </h3>
            <p className="text-[#e8d5b7] text-sm mt-1 font-serif">
              {cards.length} cartas disponibles {cards.length > cardsPerPage && `• Página ${currentPage} de ${totalPages}`}
            </p>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full stone-texture flex items-center justify-center border-4 border-[#2c1810]">
              <svg className="w-10 h-10 text-[#8b6914]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-[#e8d5b7] text-lg font-bold">No se encontraron cartas</p>
            <p className="text-[#8b6914] text-sm mt-2 font-serif">Ajusta tus filtros y vuelve a buscar</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {currentCards.map((card) => {
              const rarityBadge = getRarityBadge(card.rarityId);
              return (
                <div
                  key={card.id}
                  className={`tavern-card group relative rounded-xl p-4 border-3 wood-panel ${getRarityColor(card.rarityId)} shadow-xl`}
                >
                  {/* Badge de rareza */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide border-2 ${rarityBadge.color}`}>
                    {rarityBadge.text}
                  </div>

                  {/* Imagen de la carta */}
                  <div className="relative aspect-3/4 mb-3 rounded-lg overflow-hidden border-2 border-[#2c1810] shadow-lg">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Información */}
                  <div className="space-y-3">
                    <h4 className="font-black text-[#f4e9d8] text-sm leading-tight truncate" title={card.name} style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {card.name}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/40 rounded-md border-2 border-blue-500">
                        <span className="text-blue-200 font-black text-xs">MANA</span>
                        <span className="text-white font-black">{card.manaCost}</span>
                      </div>
                      <div className="flex-1 text-right text-[#8b6914] font-mono text-[10px] font-bold">
                        #{card.id}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToDeck(card)}
                      disabled={!currentDeckId}
                      className={`w-full py-2.5 px-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all ${
                        currentDeckId
                          ? 'btn-tavern text-[#2c1810]'
                          : 'stone-texture text-[#8b6914] cursor-not-allowed border-2 border-[#2c1810]'
                      }`}
                    >
                      {currentDeckId ? 'AGREGAR' : 'SIN MAZO'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`group flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all ${
                  currentPage === 1
                    ? 'stone-texture text-[#8b6914] cursor-not-allowed opacity-50 border-2 border-[#2c1810]'
                    : 'btn-tavern text-[#2c1810]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                ANTERIOR
              </button>

              <div className="px-6 py-3 rounded-lg parchment border-3 border-[#8b6914] shadow-lg">
                <span className="text-sm font-black text-[#2c1810] tracking-wider">
                  PÁGINA <span className="text-lg mx-1">{currentPage}</span> DE <span className="text-lg mx-1">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`group flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all ${
                  currentPage === totalPages
                    ? 'stone-texture text-[#8b6914] cursor-not-allowed opacity-50 border-2 border-[#2c1810]'
                    : 'btn-tavern text-[#2c1810]'
                }`}
              >
                SIGUIENTE
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
}
