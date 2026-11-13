// Filters, Sort & Search Module
import { getState, setState, subscribe } from './state.js';
import { t } from './i18n.js';

function getDisplayName(item, tab) {
    switch (tab) {
        case 'characters': return item.fullName || item.nickname || '';
        case 'spells': return item.spell || '';
        case 'houses': return item.house || '';
        case 'books': return item.title || '';
        default: return '';
    }
}

function getSortKey(item, tab) {
    const name = getDisplayName(item, tab);
    return name.toLowerCase();
}

export function applyFilters(data, tab) {
    const state = getState();
    const filters = state.filters[tab] || {};
    const searchQuery = state.searchQuery.toLowerCase();
    
    let filtered = [...data];
    
    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(item => {
            const searchableText = getSearchableText(item, tab).toLowerCase();
            return searchableText.includes(searchQuery);
        });
    }
    
    // Tab-specific filters
    switch (tab) {
        case 'characters':
            if (filters.house) {
                filtered = filtered.filter(item => item.hogwartsHouse === filters.house);
            }
            if (filters.hasChildren !== null && filters.hasChildren !== undefined && filters.hasChildren !== '') {
                const targetHasChildren = filters.hasChildren === true || filters.hasChildren === 'true';
                filtered = filtered.filter(item => {
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                    return hasChildren === targetHasChildren;
                });
            }
            break;
            
        case 'spells':
            if (filters.useContains) {
                const useQuery = filters.useContains.toLowerCase();
                filtered = filtered.filter(item => 
                    (item.use || '').toLowerCase().includes(useQuery)
                );
            }
            break;
            
        case 'books':
            if (filters.minPages) {
                const min = parseInt(filters.minPages);
                if (!isNaN(min)) {
                    filtered = filtered.filter(item => (item.pages || 0) >= min);
                }
            }
            if (filters.maxPages) {
                const max = parseInt(filters.maxPages);
                if (!isNaN(max)) {
                    filtered = filtered.filter(item => (item.pages || 0) <= max);
                }
            }
            break;
    }
    
    // Sort
    const sortOption = state.sortOption;
    filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortOption) {
            case 'name-asc':
                aVal = getSortKey(a, tab);
                bVal = getSortKey(b, tab);
                return aVal.localeCompare(bVal);
            case 'name-desc':
                aVal = getSortKey(a, tab);
                bVal = getSortKey(b, tab);
                return bVal.localeCompare(aVal);
            case 'index-asc':
                return (a.index !== undefined ? a.index : 0) - (b.index !== undefined ? b.index : 0);
            case 'index-desc':
                return (b.index !== undefined ? b.index : 0) - (a.index !== undefined ? a.index : 0);
            default:
                return 0;
        }
    });
    
    return filtered;
}

function getSearchableText(item, tab) {
    switch (tab) {
        case 'characters':
            return `${item.fullName || ''} ${item.nickname || ''} ${item.hogwartsHouse || ''} ${item.interpretedBy || ''} ${(item.children || []).join(' ')}`;
        case 'spells':
            return `${item.spell || ''} ${item.use || ''}`;
        case 'houses':
            return `${item.house || ''} ${item.founder || ''} ${item.animal || ''} ${(item.colors || []).join(' ')}`;
        case 'books':
            return `${item.title || ''} ${item.originalTitle || ''} ${item.description || ''}`;
        default:
            return '';
    }
}

export function updateActiveFiltersDisplay() {
    const state = getState();
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    const filters = state.filters[state.currentTab] || {};
    const badges = [];
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            const label = getFilterLabel(key, state.currentTab);
            badges.push({ key, value, label });
        }
    });
    
    if (state.searchQuery) {
        badges.unshift({ key: 'search', value: state.searchQuery, label: t('searchLabel') });
    }
    
    if (badges.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = badges.map(badge => `
        <span class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 border border-gold/30 rounded-full text-sm" data-filter-key="${badge.key}">
            ${badge.label}: ${escapeHtml(String(badge.value))}
            <button class="ml-1 hover:text-amber-700" data-clear-filter="${badge.key}" aria-label="Remove filter">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </span>
    `).join('');
    
    // Add event listeners for clearing individual filters
    container.querySelectorAll('[data-clear-filter]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = e.currentTarget.getAttribute('data-clear-filter');
            clearFilter(key);
        });
    });
}

function getFilterLabel(key, tab) {
    const labels = {
        house: t('houseLabel'),
        hasChildren: t('hasChildren'),
        useContains: t('useContains'),
        minPages: t('minPages'),
        maxPages: t('maxPages')
    };
    return labels[key] || key;
}

function clearFilter(key) {
    const state = getState();
    const tab = state.currentTab;

    if (key === 'search') {
        setState('searchQuery', '');
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
    } else if (state.filters[tab] && state.filters[tab][key] !== undefined) {
        const defaultFilters = getDefaultFilters(tab);
        setState(`filters.${tab}.${key}`, defaultFilters[key]);
    }

    // Re-apply filters
    window.dispatchEvent(new CustomEvent('filtersChanged'));
}

function getDefaultFilters(tab) {
    switch (tab) {
        case 'characters': return { house: '', hasChildren: null };
        case 'spells': return { useContains: '' };
        case 'houses': return {};
        case 'books': return { minPages: '', maxPages: '' };
        default: return {};
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function renderFilterModal() {
    const state = getState();
    const tab = state.currentTab;
    const filters = state.filters[tab] || {};
    const content = document.getElementById('filterModalContent');
    if (!content) return;
    
    let html = '';
    
    switch (tab) {
        case 'characters':
            html = `
                <div>
                    <label class="block text-sm font-medium text-amber-200 mb-2" data-i18n="houseLabel">House</label>
                    <select id="filterHouse" class="w-full px-4 py-2 bg-amber-800 border border-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">${t('houseLabel')} (All)</option>
                        <option value="Gryffindor">🦁 Gryffindor</option>
                        <option value="Hufflepuff">🦡 Hufflepuff</option>
                        <option value="Ravenclaw">🦅 Ravenclaw</option>
                        <option value="Slytherin">🐍 Slytherin</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-amber-200 mb-2" data-i18n="hasChildren">Has Children</label>
                    <select id="filterHasChildren" class="w-full px-4 py-2 bg-amber-800 border border-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">${t('hasChildren')} (All)</option>
                        <option value="true">${t('yes')}</option>
                        <option value="false">${t('no')}</option>
                    </select>
                </div>
            `;
            break;
            
        case 'spells':
            html = `
                <div>
                    <label class="block text-sm font-medium text-amber-200 mb-2" data-i18n="useContains">Use Contains</label>
                    <input type="text" id="filterUseContains" placeholder="${t('useContains')}" 
                        class="w-full px-4 py-2 bg-amber-800 border border-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                        value="${escapeHtml(filters.useContains || '')}">
                </div>
            `;
            break;
            
        case 'books':
            html = `
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-amber-200 mb-2" data-i18n="minPages">Min Pages</label>
                        <input type="number" id="filterMinPages" placeholder="${t('minPages')}" 
                            class="w-full px-4 py-2 bg-amber-800 border border-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            value="${escapeHtml(filters.minPages || '')}" min="0">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-amber-200 mb-2" data-i18n="maxPages">Max Pages</label>
                        <input type="number" id="filterMaxPages" placeholder="${t('maxPages')}" 
                            class="w-full px-4 py-2 bg-amber-800 border border-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            value="${escapeHtml(filters.maxPages || '')}" min="0">
                    </div>
                </div>
            `;
            break;
            
        case 'houses':
            html = '<p class="text-amber-200 text-center py-4" data-i18n="noFiltersAvailable">No filters available for Houses</p>';
            break;
    }
    
    content.innerHTML = html;
    
    // Set current filter values
    Object.entries(filters).forEach(([key, value]) => {
        const el = document.getElementById(`filter${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = value;
            } else {
                el.value = value;
            }
        }
    });
    
    // Apply button handler
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.onclick = () => {
            const newFilters = {};
            const filterElements = content.querySelectorAll('input, select');
            filterElements.forEach(el => {
                if (el.type === 'checkbox') {
                    newFilters[el.id.replace('filter', '').toLowerCase()] = el.checked;
                } else {
                    newFilters[el.id.replace('filter', '').toLowerCase()] = el.value;
                }
            });
            
            // Fix camelCase for specific keys
            if (newFilters.haschildren !== undefined) newFilters.hasChildren = newFilters.haschildren;
            if (newFilters.usecontains !== undefined) newFilters.useContains = newFilters.usecontains;
            if (newFilters.minpages !== undefined) newFilters.minPages = newFilters.minpages;
            if (newFilters.maxpages !== undefined) newFilters.maxPages = newFilters.maxpages;
            
            Object.keys(newFilters).forEach(key => {
                if (key !== 'haschildren' && key !== 'usecontains' && key !== 'minpages' && key !== 'maxpages') {
                    setState(`filters.${tab}.${key}`, newFilters[key]);
                }
            });
            
            window.dispatchEvent(new CustomEvent('filtersChanged'));
            closeFilterModal();
        };
    }
    
    // Clear button handler
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.onclick = () => {
            const defaultFilters = getDefaultFilters(tab);
            Object.keys(defaultFilters).forEach(key => {
                setState(`filters.${tab}.${key}`, defaultFilters[key]);
            });
            setState('searchQuery', '');
            document.getElementById('searchInput').value = '';
            window.dispatchEvent(new CustomEvent('filtersChanged'));
            renderFilterModal(); // Re-render to show cleared values
        };
    }
}

export function openFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        renderFilterModal();
        document.body.style.overflow = 'hidden';
    }
}

export function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

export function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterBtn = document.getElementById('filterBtn');
    const closeFilterModalBtn = document.getElementById('closeFilterModal');
    const filterModal = document.getElementById('filterModal');
    
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                setState('searchQuery', e.target.value);
                window.dispatchEvent(new CustomEvent('filtersChanged'));
            }, 300);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            setState('sortOption', e.target.value);
            window.dispatchEvent(new CustomEvent('filtersChanged'));
        });
    }
    
    if (filterBtn) {
        filterBtn.addEventListener('click', openFilterModal);
    }
    
    if (closeFilterModalBtn) {
        closeFilterModalBtn.addEventListener('click', closeFilterModal);
    }
    
    if (filterModal) {
        filterModal.addEventListener('click', (e) => {
            if (e.target === filterModal) closeFilterModal();
        });
    }
    
    // Subscribe to filter changes to update active filters display
    subscribe('filters', updateActiveFiltersDisplay);
    subscribe('searchQuery', updateActiveFiltersDisplay);
    subscribe('sortOption', updateActiveFiltersDisplay);
    subscribe('currentTab', updateActiveFiltersDisplay);
}