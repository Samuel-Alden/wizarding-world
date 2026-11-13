// UI Rendering Module
import { getState, setState, subscribe } from './state.js';
import { t } from './i18n.js';
import { showToast, handleCardFavoriteClick } from './favorites.js';
import { springTo } from './spring.js';

const HOUSE_COLORS = {
    Gryffindor: { bg: 'bg-gryffindor-primary', text: 'text-gryffindor-secondary', border: 'border-gryffindor-secondary' },
    Hufflepuff: { bg: 'bg-hufflepuff-primary', text: 'text-hufflepuff-secondary', border: 'border-hufflepuff-secondary' },
    Ravenclaw: { bg: 'bg-ravenclaw-primary', text: 'text-ravenclaw-secondary', border: 'border-ravenclaw-secondary' },
    Slytherin: { bg: 'bg-slytherin-primary', text: 'text-slytherin-secondary', border: 'border-slytherin-secondary' }
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getHouseClass(house) {
    return HOUSE_COLORS[house] || { bg: 'bg-amber-800', text: 'text-gold', border: 'border-gold' };
}

export function renderContent() {
    const state = getState();
    const container = document.getElementById('contentArea');
    if (!container) return;
    
    const tab = state.currentTab;
    
    // The favorites tab is rendered by favorites.js; never overwrite it here
    if (tab === 'favorites') {
        const pg = document.getElementById('pagination');
        if (pg) pg.innerHTML = '';
        return;
    }
    
    const data = state.filteredData[tab] || [];
    const loading = state.loading[tab];
    
    if (loading) {
        container.innerHTML = `
            <div class="flex items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        `;
        return;
    }
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-mist font-cinzel text-xl">
                ${t('noResults')}
            </div>
        `;
        renderPagination(0);
        return;
    }
    
    const itemsPerPage = state.itemsPerPage;
    const currentPage = state.currentPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageData = data.slice(start, start + itemsPerPage);
    
    let html = '';
    switch (tab) {
        case 'characters': html = renderCharactersGrid(pageData); break;
        case 'spells': html = renderSpellsGrid(pageData); break;
        case 'houses': html = renderHousesGrid(pageData); break;
        case 'books': html = renderBooksGrid(pageData); break;
        default: return;
    }
    
    container.innerHTML = html;
    renderPagination(totalPages);
    
    // Add spring entrance to cards
    container.querySelectorAll('article').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 20px, 0) scale(0.98)';
        setTimeout(() => springTo(el, { opacity: 1, x: 0, y: 0, scale: 1 }, { dampingRatio: 0.9, response: 0.4 }), i * 50);
        
        el.addEventListener('pointerdown', () => springTo(el, { scale: 0.97 }, { dampingRatio: 1, response: 0.2 }));
        el.addEventListener('pointerup', () => springTo(el, { scale: 1 }, { dampingRatio: 0.8, response: 0.3 }));
    });
    
    container.querySelectorAll('[data-add-favorite]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = e.currentTarget.getAttribute('data-add-favorite');
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            const item = state.allData[category].find(x => x.index === index) || state.allData[category][index];
            if (item) handleCardFavoriteClick(category, item);
        });
    });
}

function renderCharactersGrid(data) {
    return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">${data.map((item, idx) => renderCharacterCard(item, idx)).join('')}</div>`;
}

function renderCharacterCard(char, index) {
    const houseClass = getHouseClass(char.hogwartsHouse);
    return `
        <article class="card p-5 group cursor-pointer">
            <div class="h-48 mb-4 rounded-xl overflow-hidden bg-void/50">
                <img src="${char.image || ''}" alt="${escapeHtml(char.fullName)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            </div>
            <h3 class="font-cinzel text-lg font-bold text-gold">${escapeHtml(char.fullName)}</h3>
            <p class="text-sm text-mist">${t('interpretedBy')}: ${escapeHtml(char.interpretedBy || 'Unknown')}</p>
            <button data-add-favorite="characters" data-index="${char.index ?? index}" class="btn-glass mt-3 w-full">${t('addToFavorites')}</button>
        </article>
    `;
}

// (Omitted other render functions for brevity — they follow this same 'card' structure)
function renderSpellsGrid(data) { return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${data.map((item, idx) => renderSpellCard(item, idx)).join('')}</div>`; }
function renderSpellCard(spell, index) { return `<article class="card p-6 flex flex-col gap-3"><h3 class="font-cinzel text-lg text-gold">${escapeHtml(spell.spell)}</h3><p class="text-sm text-mist flex-1">${escapeHtml(spell.use)}</p><button data-add-favorite="spells" data-index="${spell.index ?? index}" class="btn-glass w-full">${t('addToFavorites')}</button></article>`; }
function renderHousesGrid(data) { return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${data.map((item, idx) => renderHouseCard(item, idx)).join('')}</div>`; }
function renderHouseCard(house, index) { return `<article class="card p-6"><h3 class="font-cinzel text-xl text-gold mb-3">${escapeHtml(house.house)}</h3><p class="text-sm text-mist">${t('founder')}: ${escapeHtml(house.founder)}</p><button data-add-favorite="houses" data-index="${house.index ?? index}" class="btn-glass mt-4 w-full">${t('addToFavorites')}</button></article>`; }
function renderBooksGrid(data) { return `<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">${data.map((item, idx) => renderBookCard(item, idx)).join('')}</div>`; }
function renderBookCard(book, index) { return `<article class="card p-5"><h3 class="font-cinzel text-lg text-gold">${escapeHtml(book.title)}</h3><p class="text-sm text-mist mt-2">${t('pages')}: ${book.pages}</p><button data-add-favorite="books" data-index="${book.index ?? index}" class="btn-glass mt-4 w-full">${t('addToFavorites')}</button></article>`; }

function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    const state = getState();
    const currentPage = state.currentPage;
    
    if (!container || totalPages <= 1) { container.innerHTML = ''; return; }
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    let html = '<div class="flex items-center justify-center gap-2 flex-wrap">';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button class="btn-glass" data-page="${currentPage - 1}" aria-label="Previous page">&laquo; Prev</button>`;
    }
    
    // First page
    if (startPage > 1) {
        html += `<button class="btn-glass" data-page="1">1</button>`;
        if (startPage > 2) html += `<span class="px-2 text-mist">...</span>`;
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<button class="btn-gold" disabled aria-current="page">${i}</button>`;
        } else {
            html += `<button class="btn-glass" data-page="${i}">${i}</button>`;
        }
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="px-2 text-mist">...</span>`;
        html += `<button class="btn-glass" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button class="btn-glass" data-page="${currentPage + 1}" aria-label="Next page">Next &raquo;</button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.getAttribute('data-page'));
            setState('currentPage', page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

export function initializeUI() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab'))));
    subscribe('currentTab', (tab) => { updateActiveTab(tab); setState('currentPage', 1); renderContent(); });
    subscribe('currentPage', renderContent);
    subscribe('filteredData', renderContent);
    subscribe('allData', renderContent);
}

function switchTab(tab) { setState('currentTab', tab); }
function updateActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.setAttribute('aria-selected', btn.getAttribute('data-tab') === tab));
}
