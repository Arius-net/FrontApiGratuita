// TypeScript Interfaces para la API de Hearthstone

export interface HearthstoneCard {
  id: number;
  collectible: number;
  slug: string;
  classId: number;
  multiClassIds: number[];
  cardTypeId: number;
  cardSetId: number;
  rarityId: number;
  artistName: string;
  manaCost: number;
  name: string;
  text: string;
  image: string;
  imageGold: string;
  flavorText: string;
  cropImage: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: HearthstoneCard[];
  createdAt: string;
  updatedAt: string;
}

export interface DeckStats {
  totalCards: number;
  averageManaCost: number;
  cardsByRarity: Record<number, number>;
  cardsByClass: Record<number, number>;
  maxCards: number;
  slotsRemaining: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    details?: string;
    timestamp: string;
  };
}

export interface CardsResponse {
  cards: HearthstoneCard[];
  total: number;
}

export interface DecksResponse {
  decks: Deck[];
  total: number;
}

export interface SearchFilters {
  set?: string;
  class?: string;
  manaCost?: number;
  attack?: number;
  health?: number;
  collectible?: number;
  rarity?: string;
  type?: string;
  minionType?: string;
  keyword?: string;
  textFilter?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
