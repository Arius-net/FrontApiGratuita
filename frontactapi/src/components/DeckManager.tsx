'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { deckService } from '@/services/hearthstoneService';
import { handleApiError } from '@/services/apiClient';
import type { Deck, DeckStats } from '@/types/api.types';

interface DeckManagerProps {
  onDeckSelect: (deckId: string | null) => void;
  currentDeckId: string | null;
}

export default function DeckManager({ onDeckSelect, currentDeckId }: DeckManagerProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckStats, setDeckStats] = useState<DeckStats | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      fetchDeckStats(selectedDeck.id);
    }
  }, [selectedDeck]);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await deckService.getAllDecks();
      setDecks(response.data.decks);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeckStats = async (deckId: string) => {
    try {
      const response = await deckService.getDeckStats(deckId);
      setDeckStats(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) {
      alert('Ingresa un nombre para el mazo');
      return;
    }

    try {
      const response = await deckService.createDeck(newDeckName.trim());
      setDecks([...decks, response.data]);
      setNewDeckName('');
      alert('Mazo creado exitosamente!');
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const handleSelectDeck = async (deck: Deck) => {
    try {
      const response = await deckService.getDeckById(deck.id);
      setSelectedDeck(response.data);
      onDeckSelect(deck.id);
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    if (!selectedDeck) return;

    try {
      const response = await deckService.removeCardFromDeck(selectedDeck.id, cardId);
      setSelectedDeck(response.data);
      fetchDeckStats(selectedDeck.id);
      
      // Actualizar la lista de mazos
      setDecks(decks.map(d => d.id === selectedDeck.id ? response.data : d));
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const handleClearDeck = async () => {
    if (!selectedDeck || !window.confirm('¿Seguro que quieres limpiar el mazo?')) return;

    try {
      const response = await deckService.clearDeck(selectedDeck.id);
      setSelectedDeck(response.data);
      fetchDeckStats(selectedDeck.id);
      
      // Actualizar la lista de mazos
      setDecks(decks.map(d => d.id === selectedDeck.id ? response.data : d));
      
      alert('Mazo limpiado');
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este mazo?')) return;

    try {
      await deckService.deleteDeck(deckId);
      setDecks(decks.filter((d) => d.id !== deckId));
      
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
        setDeckStats(null);
        onDeckSelect(null);
      }
      
      alert('Mazo eliminado');
    } catch (err) {
      alert(`Error: ${handleApiError(err)}`);
    }
  };

  const getRarityDot = (rarityId: number) => {
    switch (rarityId) {
      case 5: return 'bg-amber-500';
      case 4: return 'bg-purple-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-stone-500';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Crear nuevo mazo - Taberna */}
      <div className="wood-frame rounded-2xl p-6 lg:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gold-border gold-gradient flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#2c1810]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#d4af37] tracking-wide">CREAR NUEVO MAZO</h2>
            <p className="text-[#e8d5b7] text-sm font-serif">Construye tu estrategia perfecta</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ej: Mazo de Control Mago"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDeck()}
            className="input-parchment flex-1 px-5 py-4 rounded-xl focus:outline-none transition-all font-bold"
          />
          <button
            onClick={handleCreateDeck}
            className="btn-tavern px-8 py-4 text-[#2c1810] rounded-xl"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              CREAR
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="wood-panel border-4 border-red-900 rounded-xl p-4">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de mazos - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="wood-frame rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-[#d4af37]">MIS MAZOS</h2>
                <p className="text-[#e8d5b7] text-sm mt-1 font-serif">{decks.length} mazos creados</p>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full border-2 border-[#2c1810]"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[#e8d5b7] text-sm font-bold">Cargando mazos...</p>
              </div>
            ) : decks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full stone-texture flex items-center justify-center border-4 border-[#2c1810]">
                  <svg className="w-8 h-8 text-[#8b6914]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-[#e8d5b7] font-bold mb-2">No tienes mazos</p>
                <p className="text-[#8b6914] text-sm font-serif">Crea tu primer mazo arriba</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {decks.map((deck) => (
                  <div
                    key={deck.id}
                    className={`group relative tavern-card rounded-xl p-4 border-3 transition-all cursor-pointer ${
                      currentDeckId === deck.id
                        ? 'gold-border shadow-xl animate-glow'
                        : 'wood-panel border-[#6b402e]'
                    }`}
                    onClick={() => handleSelectDeck(deck)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-black text-[#f4e9d8] text-sm mb-1 leading-tight" style={{
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>
                          {deck.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#e8d5b7]">
                          <span className="flex items-center gap-1 font-bold">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {deck.cards.length}/30
                          </span>
                        </div>
                      </div>
                      {currentDeckId === deck.id && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md gold-border gold-gradient">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2c1810] animate-pulse"></div>
                          <span className="text-[10px] font-black text-[#2c1810] uppercase">ACTIVO</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDeck(deck.id);
                      }}
                      className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border-2 border-red-800 hover:border-red-700 text-red-400 text-xs font-black rounded-lg transition-all uppercase"
                    >
                      ELIMINAR
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detalle del mazo */}
        <div className="lg:col-span-8">
          {!selectedDeck ? (
            <div className="wood-frame rounded-2xl p-12 text-center shadow-2xl">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full stone-texture flex items-center justify-center border-4 border-[#2c1810]">
                  <svg className="w-10 h-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-[#d4af37] mb-2">SELECCIONA UN MAZO</h3>
                <p className="text-[#e8d5b7] font-serif">
                  Elige un mazo de la lista para ver sus cartas y estadísticas
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header del mazo */}
              <div className="wood-frame rounded-2xl p-6 lg:p-8 shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-[#d4af37] mb-2 tracking-wide" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {selectedDeck.name}
                    </h2>
                    <p className="text-[#e8d5b7] text-sm font-serif">
                      Creado el {new Date(selectedDeck.createdAt).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  {selectedDeck.cards.length > 0 && (
                    <button
                      onClick={handleClearDeck}
                      className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border-2 border-red-800 text-red-400 text-sm font-black rounded-lg transition-all uppercase"
                    >
                      LIMPIAR MAZO
                    </button>
                  )}
                </div>

                {/* Estadísticas */}
                {deckStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative rounded-xl p-4 parchment border-3 border-[#8b6914] shadow-lg">
                      <div className="text-2xl lg:text-3xl font-black text-blue-700 mb-1">
                        {deckStats.totalCards}
                      </div>
                      <div className="text-xs font-black text-[#2c1810] uppercase tracking-wider">
                        CARTAS
                      </div>
                    </div>
                    <div className="relative rounded-xl p-4 parchment border-3 border-[#8b6914] shadow-lg">
                      <div className="text-2xl lg:text-3xl font-black text-purple-700 mb-1">
                        {deckStats.averageManaCost.toFixed(1)}
                      </div>
                      <div className="text-xs font-black text-[#2c1810] uppercase tracking-wider">
                        PROMEDIO
                      </div>
                    </div>
                    <div className="relative rounded-xl p-4 parchment border-3 border-[#8b6914] shadow-lg">
                      <div className="text-2xl lg:text-3xl font-black text-green-700 mb-1">
                        {deckStats.slotsRemaining}
                      </div>
                      <div className="text-xs font-black text-[#2c1810] uppercase tracking-wider">
                        ESPACIOS
                      </div>
                    </div>
                    <div className="relative rounded-xl p-4 parchment border-3 border-[#8b6914] shadow-lg">
                      <div className="text-2xl lg:text-3xl font-black text-orange-700 mb-1">
                        {deckStats.maxCards}
                      </div>
                      <div className="text-xs font-black text-[#2c1810] uppercase tracking-wider">
                        MÁXIMO
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cartas del mazo */}
              <div className="wood-frame rounded-2xl p-6 lg:p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-[#d4af37] mb-2">CARTAS DEL MAZO</h3>
                  <p className="text-[#e8d5b7] text-sm font-serif">
                    {selectedDeck.cards.length === 0 
                      ? 'Ve a la pestaña de Cartas para agregar algunas' 
                      : `${selectedDeck.cards.length} cartas en tu mazo`}
                  </p>
                </div>

                {selectedDeck.cards.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full stone-texture flex items-center justify-center border-4 border-[#2c1810]">
                      <svg className="w-10 h-10 text-[#8b6914]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[#e8d5b7] font-bold">El mazo está vacío</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedDeck.cards.map((card) => (
                      <div
                        key={card.id}
                        className="group relative tavern-card rounded-xl p-3 wood-panel border-2 border-[#6b402e] shadow-lg"
                      >
                        <div className="relative aspect-3/4 mb-3 rounded-lg overflow-hidden border-2 border-[#2c1810] shadow-md">
                          <Image
                            src={card.image}
                            alt={card.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                        <h4 className="text-sm font-black text-[#f4e9d8] truncate mb-2" title={card.name} style={{
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>
                          {card.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/40 rounded-md border-2 border-blue-500">
                            <span className="text-[10px] text-blue-200 font-black">MANA {card.manaCost}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getRarityDot(card.rarityId)}`} />
                        </div>
                        <button
                          onClick={() => handleRemoveCard(card.id)}
                          className="w-full py-2 px-3 bg-red-900/30 hover:bg-red-900/50 border-2 border-red-800 hover:border-red-700 text-red-400 text-xs font-black rounded-lg transition-all uppercase"
                        >
                          QUITAR
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
