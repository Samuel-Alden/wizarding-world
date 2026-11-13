// State Management Module
const state = {
    currentTab: 'characters',
    currentLanguage: 'en',
    searchQuery: '',
    sortOption: 'name-asc',
    filters: {
        characters: { house: '', hasChildren: null },
        spells: { useContains: '' },
        houses: {},
        books: { minPages: '', maxPages: '' }
    },
    activeFilters: {},
    currentPage: 1,
    itemsPerPage: 12,
    allData: {
        characters: [],
        spells: [],
        houses: [],
        books: []
    },
    filteredData: {
        characters: [],
        spells: [],
        houses: [],
        books: []
    },
    loading: {
        characters: false,
        spells: false,
        houses: false,
        books: false
    },
    favorites: {
        characters: [],
        spells: [],
        houses: [],
        books: []
    },
    userName: ''
};

const listeners = new Map();

export function getState() {
    return state;
}

export function setState(key, value) {
    const keys = key.split('.');
    let obj = state;
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    notifyListeners(key, value);
}

export function updateState(updates) {
    Object.entries(updates).forEach(([key, value]) => {
        setState(key, value);
    });
}

export function subscribe(key, callback) {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => {
        listeners.get(key).delete(callback);
    };
}

function notifyListeners(key, value) {
    if (listeners.has(key)) {
        listeners.get(key).forEach(cb => cb(value));
    }
    // Also notify parent keys
    const parts = key.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
        const parentKey = parts.slice(0, i).join('.');
        if (listeners.has(parentKey)) {
            listeners.get(parentKey).forEach(cb => cb(getNestedState(parentKey)));
        }
    }
}

function getNestedState(key) {
    const keys = key.split('.');
    let obj = state;
    for (const k of keys) {
        obj = obj[k];
    }
    return obj;
}

export function resetFilters(tab) {
    if (tab && state.filters[tab]) {
        state.filters[tab] = getDefaultFilters(tab);
    } else {
        Object.keys(state.filters).forEach(tab => {
            state.filters[tab] = getDefaultFilters(tab);
        });
    }
    notifyListeners('filters', state.filters);
}

function getDefaultFilters(tab) {
    switch (tab) {
        case 'characters':
            return { house: '', hasChildren: null };
        case 'spells':
            return { useContains: '' };
        case 'houses':
            return {};
        case 'books':
            return { minPages: '', maxPages: '' };
        default:
            return {};
    }
}