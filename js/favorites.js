// Favorites & LocalStorage Module
import { getState, setState, subscribe } from './state.js';
import { t } from './i18n.js';

const STORAGE_KEY = 'wizardingWorldFavorites';

export function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure all categories are arrays (migrate from old format)
            const favorites = parsed.favorites || {};
            const categories = ['characters', 'spells', 'houses', 'books'];
            categories.forEach(cat => {
                if (!Array.isArray(favorites[cat])) {
                    favorites[cat] = favorites[cat] ? [favorites[cat]] : [];
                }
            });
            setState('favorites', favorites);
            setState('userName', parsed.userName || '');
            return parsed;
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
    return { favorites: { characters: [], spells: [], houses: [], books: [] }, userName: '' };
}

export function saveFavorites(favorites, userName) {
    try {
        const data = { favorites, userName, savedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setState('favorites', favorites);
        setState('userName', userName);
        return { success: true };
    } catch (error) {
        console.error('Error saving favorites:', error);
        return { success: false, error: error.message };
    }
}

export function clearFavorites() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        setState('favorites', { characters: [], spells: [], houses: [], books: [] });
        setState('userName', '');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export function addFavorite(category, item) {
    const state = getState();
    const favorites = { ...state.favorites };
    if (!Array.isArray(favorites[category])) favorites[category] = [];
    // Avoid duplicates by checking index
    const exists = favorites[category].some(fav => fav.index === item.index);
    if (!exists) {
        favorites[category].push(item);
    }
    return saveFavorites(favorites, state.userName);
}

export function removeFavorite(category, itemIndex) {
    const state = getState();
    const favorites = { ...state.favorites };
    if (Array.isArray(favorites[category])) {
        favorites[category] = favorites[category].filter(fav => fav.index !== itemIndex);
    }
    return saveFavorites(favorites, state.userName);
}

export function getFavorites(category) {
    const state = getState();
    return state.favorites[category] || [];
}

export function hasFavorite(category) {
    const state = getState();
    const favs = state.favorites[category];
    return Array.isArray(favs) && favs.length > 0;
}

// Pending favorite set when user clicks a card's favorite button before saving
let pendingItem = null;

// Favorites modal (save new)
export function openFavoritesModal(pendingCategory = null) {
    const favoritesModal = document.getElementById('favoritesModal');
    const favoritesNameInput = document.getElementById('favoritesNameInput');
    
    renderFavoritesCategorySelect();
    if (pendingCategory) {
        // Pre-check the pending category
        const cb = document.querySelector(`#favoritesCategorySelect input[value="${pendingCategory}"]`);
        if (cb) cb.checked = true;
    }
    if (favoritesModal) {
        favoritesModal.classList.remove('hidden');
        favoritesModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        setTimeout(() => favoritesNameInput?.focus(), 100);
    }
}

export function handleCardFavoriteClick(category, item) {
    const state = getState();
    if (state.userName) {
        // Already have a name: add/update directly
        addFavorite(category, item);
        showToast(t('favoritesSaved'), 'success');
        if (state.currentTab === 'favorites') renderFavoritesTab();
    } else {
        // No name yet: open modal with this item pre-selected
        pendingItem = { category, item };
        openFavoritesModal(category);
    }
}

export function initializeFavorites() {
    loadFavorites();

    // Modal elements
    const favoritesModal = document.getElementById('favoritesModal');
    const viewFavoritesModal = document.getElementById('viewFavoritesModal');
    const closeFavoritesModal = document.getElementById('closeFavoritesModal');
    const closeViewFavoritesModal = document.getElementById('closeViewFavoritesModal');
    const cancelFavorites = document.getElementById('cancelFavorites');
    const saveFavoritesBtn = document.getElementById('saveFavorites');
    const favoritesNameInput = document.getElementById('favoritesNameInput');

    function closeFavoritesModalFn() {
        if (favoritesModal) {
            favoritesModal.classList.add('hidden');
            favoritesModal.classList.remove('flex');
            document.body.style.overflow = '';
            favoritesNameInput.value = '';
            document.querySelectorAll('#favoritesCategorySelect input').forEach(cb => cb.checked = false);
        }
    }
    
    // View favorites modal
    function openViewFavoritesModal() {
        renderViewFavoritesContent();
        if (viewFavoritesModal) {
            viewFavoritesModal.classList.remove('hidden');
            viewFavoritesModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeViewFavoritesModalFn() {
        if (viewFavoritesModal) {
            viewFavoritesModal.classList.add('hidden');
            viewFavoritesModal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    }
    
    if (closeFavoritesModal) closeFavoritesModal.addEventListener('click', closeFavoritesModalFn);
    if (closeViewFavoritesModal) closeViewFavoritesModal.addEventListener('click', closeViewFavoritesModalFn);
    if (cancelFavorites) cancelFavorites.addEventListener('click', closeFavoritesModalFn);
    
    if (favoritesModal) {
        favoritesModal.addEventListener('click', (e) => {
            if (e.target === favoritesModal) closeFavoritesModalFn();
        });
    }
    
    if (viewFavoritesModal) {
        viewFavoritesModal.addEventListener('click', (e) => {
            if (e.target === viewFavoritesModal) closeViewFavoritesModalFn();
        });
    }
    
    if (saveFavoritesBtn) {
        saveFavoritesBtn.addEventListener('click', () => {
            const name = favoritesNameInput.value.trim();
            if (!name) {
                showToast(t('nameRequired'), 'error');
                return;
            }

            const checkboxes = document.querySelectorAll('#favoritesCategorySelect input:checked');
            if (checkboxes.length === 0) {
                showToast(t('selectCategory'), 'error');
                return;
            }

            const state = getState();
            const favorites = { ...state.favorites };
            let savedCount = 0;

            for (const cb of checkboxes) {
                const category = cb.value;
                const data = state.allData[category];
                if (data && data.length > 0) {
                    // Ensure category is an array
                    if (!Array.isArray(favorites[category])) favorites[category] = [];
                    // If user clicked a specific card, save that item; otherwise default to first item
                    const itemToAdd = (pendingItem && pendingItem.category === category) ? pendingItem.item : data[0];
                    // Avoid duplicates
                    const exists = favorites[category].some(fav => fav.index === itemToAdd.index);
                    if (!exists) {
                        favorites[category].push(itemToAdd);
                        savedCount++;
                    }
                }
            }

            const result = saveFavorites(favorites, name);
            if (result.success) {
                showToast(`${t('favoritesSaved')} (${savedCount} ${t('tabFavorites').toLowerCase()})`, 'success');
                closeFavoritesModalFn();
                pendingItem = null;
                // Switch to favorites tab to show the saved data
                setState('currentTab', 'favorites');
            } else {
                showToast(`${t('favoritesLoadError')}: ${result.error}`, 'error');
            }
        });
    }
    
    // Subscribe to tab changes to update favorites tab
    subscribe('currentTab', (tab) => {
        if (tab === 'favorites') {
            renderFavoritesTab();
        }
    });
}

function renderFavoritesCategorySelect() {
    const container = document.getElementById('favoritesCategorySelect');
    if (!container) return;
    
    const categories = [
        { key: 'characters', label: '🧙 Characters' },
        { key: 'spells', label: '✨ Spells' },
        { key: 'houses', label: '🏰 Houses' },
        { key: 'books', label: '📚 Books' }
    ];
    
    container.innerHTML = categories.map(cat => `
        <label class="flex items-center gap-3 p-3 bg-amber-800 border border-gold/30 rounded-lg cursor-pointer hover:border-gold transition-colors">
            <input type="checkbox" value="${cat.key}" class="w-5 h-5 text-gold border-gold/30 rounded focus:ring-gold">
            <span class="text-amber-100">${cat.label}</span>
        </label>
    `).join('');
}

function renderViewFavoritesContent() {
    const container = document.getElementById('viewFavoritesContent');
    const state = getState();
    
    if (!container) return;
    
    const favorites = state.favorites;
    const hasAny = Object.values(favorites).some(f => Array.isArray(f) && f.length > 0);
    
    if (!hasAny) {
        container.innerHTML = `<p class="text-amber-200 text-center py-8" data-i18n="noFavorites">${t('noFavorites')}</p>`;
        return;
    }
    
    container.innerHTML = `
        <div class="mb-4 text-amber-200">
            <span class="font-medium">${t('userName') || 'Name'}:</span> ${escapeHtml(state.userName)}
        </div>
        <div class="grid gap-4">
            ${Object.entries(favorites).map(([category, items]) => {
                if (!Array.isArray(items) || items.length === 0) return '';
                return items.map(item => renderFavoriteCard(category, item)).join('');
            }).join('')}
        </div>
    `;
    
    // Add remove buttons
    container.querySelectorAll('[data-remove-favorite]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-remove-favorite');
            const itemIndex = parseInt(e.currentTarget.getAttribute('data-item-index'));
            removeFavorite(category, itemIndex);
            showToast(`${t('removeFromFavorites')}: ${category}`, 'success');
            renderViewFavoritesContent();
            // Also update favorites tab if visible
            if (state.currentTab === 'favorites') renderFavoritesTab();
        });
    });
}

function renderFavoriteCard(category, item) {
    const icons = { characters: '🧙', spells: '✨', houses: '🏰', books: '📚' };
    const icon = icons[category] || '⭐';
    
    let content = '';
    switch (category) {
        case 'characters':
            content = `
                <img src="${item.image || ''}" alt="${escapeHtml(item.fullName || '')}" class="w-16 h-16 rounded-full object-cover mx-auto mb-2" onerror="this.style.display='none'">
                <h4 class="font-cinzel text-lg font-bold text-gold">${escapeHtml(item.fullName || '')}</h4>
                <p class="text-amber-200 text-sm">${escapeHtml(item.nickname || '')}</p>
                <p class="text-amber-300 text-xs">${escapeHtml(item.hogwartsHouse || '')}</p>
            `;
            break;
        case 'spells':
            content = `
                <div class="w-16 h-16 rounded-full bg-amber-800 flex items-center justify-center mx-auto mb-2 text-3xl">${icon}</div>
                <h4 class="font-cinzel text-lg font-bold text-gold">${escapeHtml(item.spell || '')}</h4>
                <p class="text-amber-200 text-sm">${escapeHtml(item.use || '')}</p>
            `;
            break;
        case 'houses':
            content = `
                <div class="w-16 h-16 rounded-full bg-amber-800 flex items-center justify-center mx-auto mb-2 text-3xl">${item.emoji || icon}</div>
                <h4 class="font-cinzel text-lg font-bold text-gold">${escapeHtml(item.house || '')}</h4>
                <p class="text-amber-200 text-sm">${t('founder')}: ${escapeHtml(item.founder || '')}</p>
                <p class="text-amber-300 text-xs">${t('animal')}: ${escapeHtml(item.animal || '')}</p>
            `;
            break;
        case 'books':
            content = `
                <img src="${item.cover || ''}" alt="${escapeHtml(item.title || '')}" class="w-16 h-24 object-cover rounded mx-auto mb-2" onerror="this.style.display='none'">
                <h4 class="font-cinzel text-lg font-bold text-gold">${escapeHtml(item.title || '')}</h4>
                <p class="text-amber-200 text-sm">#${item.number || ''}</p>
                <p class="text-amber-300 text-xs">${item.pages || ''} ${t('pages')}</p>
            `;
            break;
    }
    
    return `
        <div class="bg-amber-800/50 border border-gold/30 rounded-xl p-4 flex gap-4">
            <div class="flex-shrink-0 w-24">${content}</div>
            <div class="flex-1 flex flex-col justify-center">
                <span class="text-xs text-amber-300 uppercase tracking-wide">${t(category)}</span>
                <button data-remove-favorite="${category}" data-item-index="${item.index}" class="mt-2 text-amber-300 hover:text-red-400 text-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    ${t('removeFromFavorites')}
                </button>
            </div>
        </div>
    `;
}

function renderFavoritesTab() {
    const container = document.getElementById('contentArea');
    const state = getState();
    
    if (!container) return;
    
    const favorites = state.favorites;
    const hasAny = Object.values(favorites).some(f => Array.isArray(f) && f.length > 0);
    
    if (!hasAny) {
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="text-6xl mb-4">📜</div>
                <h2 class="font-cinzel text-2xl text-amber-600 mb-2" data-i18n="noFavorites">${t('noFavorites')}</h2>
                <p class="text-amber-500 mb-6">${t('favoritesModalDesc')}</p>
                <button id="openFavoritesFromEmpty" class="px-6 py-3 bg-gold text-amber-900 font-medium rounded-lg hover:bg-gold/90 transition-colors" data-i18n="save">${t('save')}</button>
            </div>
        `;
        document.getElementById('openFavoritesFromEmpty')?.addEventListener('click', () => {
            document.getElementById('favoritesModal')?.classList.remove('hidden');
            document.getElementById('favoritesModal')?.classList.add('flex');
        });
        return;
    }
    
    container.innerHTML = `
        <div class="mb-6 flex justify-between items-center">
            <h2 class="font-cinzel text-2xl text-amber-800">${t('viewFavoritesTitle')} (${state.userName})</h2>
            <button id="addMoreFavorites" class="px-4 py-2 bg-amber-700 border border-gold/30 rounded-lg hover:bg-amber-600 transition-colors text-sm" data-i18n="addToFavorites">${t('addToFavorites')}</button>
        </div>
        <div class="grid gap-4" id="favoritesGrid">
            ${Object.entries(favorites).map(([category, items]) => {
                if (!Array.isArray(items) || items.length === 0) return '';
                return items.map(item => renderFavoriteCard(category, item)).join('');
            }).join('')}
        </div>
    `;
    
    document.getElementById('addMoreFavorites')?.addEventListener('click', () => {
        document.getElementById('favoritesModal')?.classList.remove('hidden');
        document.getElementById('favoritesModal')?.classList.add('flex');
    });
    
    // Add remove buttons
    container.querySelectorAll('[data-remove-favorite]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-remove-favorite');
            const itemIndex = parseInt(e.currentTarget.getAttribute('data-item-index'));
            removeFavorite(category, itemIndex);
            showToast(`${t('removeFromFavorites')}: ${category}`, 'success');
            renderFavoritesTab();
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toast notification system
export function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-amber-700',
        warning: 'bg-yellow-600'
    };
    
    const icons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
    };
    
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in ${colors[type] || colors.info}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${escapeHtml(message)}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}