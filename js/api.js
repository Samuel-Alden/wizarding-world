const API_BASE = 'https://potterapi-fedeperin.vercel.app';

const ENDPOINTS = {
    characters: '/characters',
    spells: '/spells',
    houses: '/houses',
    books: '/books'
};

const SUPPORTED_LANGS = ['en', 'es', 'fr', 'it', 'pt', 'uk'];

let currentLang = 'en';

export function setLanguage(lang) {
    if (SUPPORTED_LANGS.includes(lang)) {
        currentLang = lang;
    }
}

export function getCurrentLanguage() {
    return currentLang;
}

export function getSupportedLanguages() {
    return SUPPORTED_LANGS;
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Accept': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

export async function fetchAll(endpoint, params = {}) {
    try {
        const url = new URL(`${API_BASE}/${currentLang}${ENDPOINTS[endpoint]}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                url.searchParams.append(key, value);
            }
        });
        
        const data = await fetchWithRetry(url.toString());
        return { data, error: null };
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return { data: null, error: error.message };
    }
}

export async function fetchByIndex(endpoint, index) {
    try {
        const { data, error } = await fetchAll(endpoint, { index });
        if (error) return { data: null, error };
        const result = Array.isArray(data) ? (data[0] || null) : (data || null);
        return { data: result, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}

export async function search(endpoint, query, max = 50) {
    try {
        const { data, error } = await fetchAll(endpoint, { search: query, max });
        const result = Array.isArray(data) ? data : (data ? [data] : []);
        return { data: result, error: null };
    } catch (error) {
        return { data: [], error: error.message };
    }
}