// Servicio para interactuar con los endpoints de Hearthstone y Decks
import { fetchAPI } from './apiClient';
import type {
  ApiResponse,
  HearthstoneCard,
  CardsResponse,
  SearchFilters,
  Deck,
  DecksResponse,
  DeckStats,
} from '@/types/api.types';

// ========== SERVICIOS DE CARTAS DE HEARTHSTONE ==========

export const hearthstoneService = {
  /**
   * Obtener todas las cartas de Hearthstone
   */
  getAllCards: async () => {
    return fetchAPI<ApiResponse<CardsResponse>>('/hearthstone/cards');
  },

  /**
   * Buscar cartas con filtros
   */
  searchCards: async (filters: SearchFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = queryString 
      ? `/hearthstone/cards/search?${queryString}`
      : '/hearthstone/cards/search';
    
    return fetchAPI<ApiResponse<CardsResponse>>(endpoint);
  },

  /**
   * Obtener carta por ID
   */
  getCardById: async (cardId: number) => {
    return fetchAPI<ApiResponse<HearthstoneCard>>(`/hearthstone/cards/${cardId}`);
  },
};

// ========== SERVICIOS DE MAZOS ==========

export const deckService = {
  /**
   * Crear un nuevo mazo
   */
  createDeck: async (name: string) => {
    return fetchAPI<ApiResponse<Deck>>('/decks', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Obtener todos los mazos
   */
  getAllDecks: async () => {
    return fetchAPI<ApiResponse<DecksResponse>>('/decks');
  },

  /**
   * Obtener un mazo por ID
   */
  getDeckById: async (deckId: string) => {
    return fetchAPI<ApiResponse<Deck>>(`/decks/${deckId}`);
  },

  /**
   * Obtener estadísticas del mazo
   */
  getDeckStats: async (deckId: string) => {
    return fetchAPI<ApiResponse<DeckStats>>(`/decks/${deckId}/stats`);
  },

  /**
   * Agregar carta al mazo
   */
  addCardToDeck: async (deckId: string, card: HearthstoneCard) => {
    return fetchAPI<ApiResponse<Deck>>(`/decks/${deckId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ card }),
    });
  },

  /**
   * Eliminar carta del mazo
   */
  removeCardFromDeck: async (deckId: string, cardId: number) => {
    return fetchAPI<ApiResponse<Deck>>(`/decks/${deckId}/cards/${cardId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Limpiar mazo (eliminar todas las cartas)
   */
  clearDeck: async (deckId: string) => {
    return fetchAPI<ApiResponse<Deck>>(`/decks/${deckId}/cards`, {
      method: 'DELETE',
    });
  },

  /**
   * Eliminar mazo
   */
  deleteDeck: async (deckId: string) => {
    return fetchAPI<ApiResponse<{ message: string }>>(`/decks/${deckId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Actualizar nombre del mazo
   */
  updateDeckName: async (deckId: string, newName: string) => {
    return fetchAPI<ApiResponse<Deck>>(`/decks/${deckId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName }),
    });
  },
};
