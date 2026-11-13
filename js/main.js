// Main Entry Point
import { fetchAll, setLanguage as setApiLanguage, getCurrentLanguage } from './api.js';
import { getState, setState, subscribe } from './state.js';
import { initializeI18n, setLanguage, t } from './i18n.js';
import { initializeFilters, openFilterModal, closeFilterModal, applyFilters } from './filters.js';
import { initializeFavorites, loadFavorites, showToast } from './favorites.js';
import { initializeUI, renderContent } from './ui.js';
import { initMagic } from './magic.js';

async function loadData(tab) {
    setState(`loading.${tab}`, true);
    renderContent();
    
    try {
        const { data, error } = await fetchAll(tab);
        if (error) {
            showToast(`${t('errorLoading')}: ${error}`, 'error');
            setState(`allData.${tab}`, []);
            setState(`filteredData.${tab}`, []);
        } else {
            setState(`allData.${tab}`, data || []);
            // Apply filters immediately
            const filtered = applyFilters(data || [], tab);
            setState(`filteredData.${tab}`, filtered);
        }
    } catch (error) {
        showToast(`${t('errorLoading')}: ${error.message}`, 'error');
        setState(`allData.${tab}`, []);
        setState(`filteredData.${tab}`, []);
    } finally {
        setState(`loading.${tab}`, false);
        renderContent();
    }
}

async function loadAllData() {
    const tabs = ['characters', 'spells', 'houses', 'books'];
    await Promise.all(tabs.map(tab => loadData(tab)));
}

function setupFilterSubscription() {
    // Subscribe to filter changes
    window.addEventListener('filtersChanged', () => {
        const state = getState();
        const tab = state.currentTab;
        const allData = state.allData[tab] || [];
        const filtered = applyFilters(allData, tab);
        setState(`filteredData.${tab}`, filtered);
        setState('currentPage', 1);
        renderContent();
    });
    
    // Subscribe to language changes
    window.addEventListener('languageChanged', (e) => {
        const lang = e.detail.lang;
        setApiLanguage(lang);
        // Reload all data with new language
        loadAllData();
    });
}

function setupGlobalErrorHandler() {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled rejection:', event.reason);
        showToast('An unexpected error occurred', 'error');
    });
    
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
}

async function initializeApp() {
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Initialize i18n first
        initializeI18n();
        
        // Load saved favorites
        loadFavorites();
        
        // Initialize modules
        initializeFilters();
        initializeFavorites();
        initializeUI();
        initMagic();
        
        // Setup subscriptions
        setupFilterSubscription();
        setupGlobalErrorHandler();
        
        // Load initial data
        await loadAllData();
        
        // Show content
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => loadingOverlay.remove(), 300);
        }
        
        console.log('Wizarding World app initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to initialize application', 'error');
        if (loadingOverlay) loadingOverlay.remove();
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for debugging
window.WizardingWorld = {
    getState,
    setState,
    loadData,
    showToast
};