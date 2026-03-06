// Cliente API para realizar peticiones al backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export interface FetchOptions extends RequestInit {
  timeout?: number;
}

export const fetchAPI = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const { timeout = 10000, ...fetchOptions } = options;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { message: `HTTP Error ${response.status}` },
      }));
      throw new Error(errorData.error?.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La petición tardó demasiado');
      }
      throw error;
    }
    throw new Error('Error desconocido al realizar la petición');
  }
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};
