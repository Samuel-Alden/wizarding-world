// Internationalization Module
const translations = {
    en: {
        siteTitle: 'Wizarding World',
        loading: 'Loading...',
        tabCharacters: 'Characters',
        tabSpells: 'Spells',
        tabHouses: 'Houses',
        tabBooks: 'Books',
        tabFavorites: 'Favorites',
        searchLabel: 'Search',
        searchPlaceholder: 'Search...',
        sortLabel: 'Sort by',
        sortNameAsc: 'Name A-Z',
        sortNameDesc: 'Name Z-A',
        sortIndexAsc: 'Index Ascending',
        sortIndexDesc: 'Index Descending',
        filterBtn: 'Filters',
        filterBtnText: 'Filters',
        filterModalTitle: 'Filters',
        clearFilters: 'Clear All',
        applyFilters: 'Apply',
        favoritesModalTitle: 'Save Favorites',
        favoritesModalDesc: 'Enter your name to save your 4 favorites (one per category).',
        favoritesNamePlaceholder: 'Your name',
        viewFavoritesTitle: 'Your Favorites',
        cancel: 'Cancel',
        save: 'Save',
        noResults: 'No results found',
        noFavorites: 'No favorites saved yet',
        character: 'Character',
        spell: 'Spell',
        house: 'House',
        book: 'Book',
        houseLabel: 'House',
        hasChildren: 'Has Children',
        yes: 'Yes',
        no: 'No',
        useContains: 'Use Contains',
        minPages: 'Min Pages',
        maxPages: 'Max Pages',
        founder: 'Founder',
        colors: 'Colors',
        animal: 'Animal',
        interpretedBy: 'Portrayed by',
        birthdate: 'Birthdate',
        children: 'Children',
        releaseDate: 'Release Date',
        pages: 'Pages',
        description: 'Description',
        use: 'Use',
        spellName: 'Spell',
        originalTitle: 'Original Title',
        cover: 'Cover',
        nickname: 'Nickname',
        fullName: 'Full Name',
        index: 'Index',
        errorLoading: 'Failed to load data. Please try again.',
        favoritesSaved: 'Favorites saved successfully!',
        favoritesLoadError: 'Failed to load favorites',
        nameRequired: 'Please enter your name',
        selectCategory: 'Please select at least one category',
        favoriteExists: 'This favorite already exists',
        viewFavorites: 'View Favorites',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        noFiltersAvailable: 'No filters available for Houses',
        userName: 'Name'
    },
    es: {
        siteTitle: 'Mundo Mágico',
        loading: 'Cargando...',
        tabCharacters: 'Personajes',
        tabSpells: 'Hechizos',
        tabHouses: 'Casas',
        tabBooks: 'Libros',
        tabFavorites: 'Favoritos',
        searchLabel: 'Buscar',
        searchPlaceholder: 'Buscar...',
        sortLabel: 'Ordenar por',
        sortNameAsc: 'Nombre A-Z',
        sortNameDesc: 'Nombre Z-A',
        sortIndexAsc: 'Índice Ascendente',
        sortIndexDesc: 'Índice Descendente',
        filterBtn: 'Filtros',
        filterBtnText: 'Filtros',
        filterModalTitle: 'Filtros',
        clearFilters: 'Limpiar Todo',
        applyFilters: 'Aplicar',
        favoritesModalTitle: 'Guardar Favoritos',
        favoritesModalDesc: 'Ingresa tu nombre para guardar tus 4 favoritos (uno por categoría).',
        favoritesNamePlaceholder: 'Tu nombre',
        viewFavoritesTitle: 'Tus Favoritos',
        cancel: 'Cancelar',
        save: 'Guardar',
        noResults: 'No se encontraron resultados',
        noFavorites: 'No hay favoritos guardados',
        character: 'Personaje',
        spell: 'Hechizo',
        house: 'Casa',
        book: 'Libro',
        houseLabel: 'Casa',
        hasChildren: 'Tiene Hijos',
        yes: 'Sí',
        no: 'No',
        useContains: 'Uso Contiene',
        minPages: 'Páginas Mín',
        maxPages: 'Páginas Máx',
        founder: 'Fundador',
        colors: 'Colores',
        animal: 'Animal',
        interpretedBy: 'Interpretado por',
        birthdate: 'Fecha de Nacimiento',
        children: 'Hijos',
        releaseDate: 'Fecha de Lanzamiento',
        pages: 'Páginas',
        description: 'Descripción',
        use: 'Uso',
        spellName: 'Hechizo',
        originalTitle: 'Título Original',
        cover: 'Portada',
        nickname: 'Apodo',
        fullName: 'Nombre Completo',
        index: 'Índice',
        errorLoading: 'Error al cargar los datos. Inténtalo de nuevo.',
        favoritesSaved: '¡Favoritos guardados con éxito!',
        favoritesLoadError: 'Error al cargar favoritos',
        nameRequired: 'Por favor ingresa tu nombre',
        selectCategory: 'Selecciona al menos una categoría',
        favoriteExists: 'Este favorito ya existe',
        viewFavorites: 'Ver Favoritos',
        addToFavorites: 'Añadir a Favoritos',
        removeFromFavorites: 'Quitar de Favoritos',
        noFiltersAvailable: 'No hay filtros disponibles para Casas',
        userName: 'Nombre'
    },
    fr: {
        siteTitle: 'Monde des Sorciers',
        loading: 'Chargement...',
        tabCharacters: 'Personnages',
        tabSpells: 'Sorts',
        tabHouses: 'Maisons',
        tabBooks: 'Livres',
        tabFavorites: 'Favoris',
        searchLabel: 'Rechercher',
        searchPlaceholder: 'Rechercher...',
        sortLabel: 'Trier par',
        sortNameAsc: 'Nom A-Z',
        sortNameDesc: 'Nom Z-A',
        sortIndexAsc: 'Index Croissant',
        sortIndexDesc: 'Index Décroissant',
        filterBtn: 'Filtres',
        filterBtnText: 'Filtres',
        filterModalTitle: 'Filtres',
        clearFilters: 'Tout Effacer',
        applyFilters: 'Appliquer',
        favoritesModalTitle: 'Sauvegarder les Favoris',
        favoritesModalDesc: 'Entrez votre nom pour sauvegarder vos 4 favoris (un par catégorie).',
        favoritesNamePlaceholder: 'Votre nom',
        viewFavoritesTitle: 'Vos Favoris',
        cancel: 'Annuler',
        save: 'Sauvegarder',
        noResults: 'Aucun résultat trouvé',
        noFavorites: 'Aucun favori sauvegardé',
        character: 'Personnage',
        spell: 'Sort',
        house: 'Maison',
        book: 'Livre',
        houseLabel: 'Maison',
        hasChildren: 'A des Enfants',
        yes: 'Oui',
        no: 'Non',
        useContains: 'Utilisation Contient',
        minPages: 'Pages Min',
        maxPages: 'Pages Max',
        founder: 'Fondateur',
        colors: 'Couleurs',
        animal: 'Animal',
        interpretedBy: 'Interprété par',
        birthdate: 'Date de Naissance',
        children: 'Enfants',
        releaseDate: 'Date de Sortie',
        pages: 'Pages',
        description: 'Description',
        use: 'Utilisation',
        spellName: 'Sort',
        originalTitle: 'Titre Original',
        cover: 'Couverture',
        nickname: 'Surnom',
        fullName: 'Nom Complet',
        index: 'Index',
        errorLoading: 'Erreur de chargement. Réessayez.',
        favoritesSaved: 'Favoris sauvegardés avec succès !',
        favoritesLoadError: 'Erreur de chargement des favoris',
        nameRequired: 'Veuillez entrer votre nom',
        selectCategory: 'Sélectionnez au moins une catégorie',
        favoriteExists: 'Ce favori existe déjà',
        viewFavorites: 'Voir les Favoris',
        addToFavorites: 'Ajouter aux Favoris',
        removeFromFavorites: 'Retirer des Favoris',
        noFiltersAvailable: 'Aucun filtre disponible pour les Maisons',
        userName: 'Nom'
    },
    it: {
        siteTitle: 'Mondo Magico',
        loading: 'Caricamento...',
        tabCharacters: 'Personaggi',
        tabSpells: 'Incantesimi',
        tabHouses: 'Case',
        tabBooks: 'Libri',
        tabFavorites: 'Preferiti',
        searchLabel: 'Cerca',
        searchPlaceholder: 'Cerca...',
        sortLabel: 'Ordina per',
        sortNameAsc: 'Nome A-Z',
        sortNameDesc: 'Nome Z-A',
        sortIndexAsc: 'Indice Crescente',
        sortIndexDesc: 'Indice Decrescente',
        filterBtn: 'Filtri',
        filterBtnText: 'Filtri',
        filterModalTitle: 'Filtri',
        clearFilters: 'Pulisci Tutto',
        applyFilters: 'Applica',
        favoritesModalTitle: 'Salva Preferiti',
        favoritesModalDesc: 'Inserisci il tuo nome per salvare i tuoi 4 preferiti (uno per categoria).',
        favoritesNamePlaceholder: 'Il tuo nome',
        viewFavoritesTitle: 'I Tuoi Preferiti',
        cancel: 'Annulla',
        save: 'Salva',
        noResults: 'Nessun risultato trovato',
        noFavorites: 'Nessun preferito salvato',
        character: 'Personaggio',
        spell: 'Incantesimo',
        house: 'Casa',
        book: 'Libro',
        houseLabel: 'Casa',
        hasChildren: 'Ha Figli',
        yes: 'Sì',
        no: 'No',
        useContains: 'Uso Contiene',
        minPages: 'Pagine Min',
        maxPages: 'Pagine Max',
        founder: 'Fondatore',
        colors: 'Colori',
        animal: 'Animale',
        interpretedBy: 'Interpretato da',
        birthdate: 'Data di Nascita',
        children: 'Figli',
        releaseDate: 'Data di Uscita',
        pages: 'Pagine',
        description: 'Descrizione',
        use: 'Uso',
        spellName: 'Incantesimo',
        originalTitle: 'Titolo Originale',
        cover: 'Copertina',
        nickname: 'Soprannome',
        fullName: 'Nome Completo',
        index: 'Indice',
        errorLoading: 'Errore nel caricamento. Riprova.',
        favoritesSaved: 'Preferiti salvati con successo!',
        favoritesLoadError: 'Errore nel caricamento dei preferiti',
        nameRequired: 'Inserisci il tuo nome',
        selectCategory: 'Seleziona almeno una categoria',
        favoriteExists: 'Questo preferito esiste già',
        viewFavorites: 'Visualizza Preferiti',
        addToFavorites: 'Aggiungi ai Preferiti',
        removeFromFavorites: 'Rimuovi dai Preferiti',
        noFiltersAvailable: 'Nessun filtro disponibile per le Case',
        userName: 'Nome'
    },
    pt: {
        siteTitle: 'Mundo Bruxo',
        loading: 'Carregando...',
        tabCharacters: 'Personagens',
        tabSpells: 'Feitiços',
        tabHouses: 'Casas',
        tabBooks: 'Livros',
        tabFavorites: 'Favoritos',
        searchLabel: 'Buscar',
        searchPlaceholder: 'Buscar...',
        sortLabel: 'Ordenar por',
        sortNameAsc: 'Nome A-Z',
        sortNameDesc: 'Nome Z-A',
        sortIndexAsc: 'Índice Crescente',
        sortIndexDesc: 'Índice Decrescente',
        filterBtn: 'Filtros',
        filterBtnText: 'Filtros',
        filterModalTitle: 'Filtros',
        clearFilters: 'Limpar Tudo',
        applyFilters: 'Aplicar',
        favoritesModalTitle: 'Salvar Favoritos',
        favoritesModalDesc: 'Digite seu nome para salvar seus 4 favoritos (um por categoria).',
        favoritesNamePlaceholder: 'Seu nome',
        viewFavoritesTitle: 'Seus Favoritos',
        cancel: 'Cancelar',
        save: 'Salvar',
        noResults: 'Nenhum resultado encontrado',
        noFavorites: 'Nenhum favorito salvo',
        character: 'Personagem',
        spell: 'Feitiço',
        house: 'Casa',
        book: 'Livro',
        houseLabel: 'Casa',
        hasChildren: 'Tem Filhos',
        yes: 'Sim',
        no: 'Não',
        useContains: 'Uso Contém',
        minPages: 'Páginas Mín',
        maxPages: 'Páginas Máx',
        founder: 'Fundador',
        colors: 'Cores',
        animal: 'Animal',
        interpretedBy: 'Interpretado por',
        birthdate: 'Data de Nascimento',
        children: 'Filhos',
        releaseDate: 'Data de Lançamento',
        pages: 'Páginas',
        description: 'Descrição',
        use: 'Uso',
        spellName: 'Feitiço',
        originalTitle: 'Título Original',
        cover: 'Capa',
        nickname: 'Apelido',
        fullName: 'Nome Completo',
        index: 'Índice',
        errorLoading: 'Falha ao carregar dados. Tente novamente.',
        favoritesSaved: 'Favoritos salvos com sucesso!',
        favoritesLoadError: 'Erro ao carregar favoritos',
        nameRequired: 'Por favor, insira seu nome',
        selectCategory: 'Selecione pelo menos uma categoria',
        favoriteExists: 'Este favorito já existe',
        viewFavorites: 'Ver Favoritos',
        addToFavorites: 'Adicionar aos Favoritos',
        removeFromFavorites: 'Remover dos Favoritos',
        noFiltersAvailable: 'Nenhum filtro disponível para Casas',
        userName: 'Nome'
    },
    uk: {
        siteTitle: 'Чарівний Світ',
        loading: 'Завантаження...',
        tabCharacters: 'Персонажі',
        tabSpells: 'Закляття',
        tabHouses: 'Факультети',
        tabBooks: 'Книги',
        tabFavorites: 'Улюблене',
        searchLabel: 'Пошук',
        searchPlaceholder: 'Пошук...',
        sortLabel: 'Сортувати за',
        sortNameAsc: 'Ім\'я А-Я',
        sortNameDesc: 'Ім\'я Я-А',
        sortIndexAsc: 'Індекс За Зростанням',
        sortIndexDesc: 'Індекс За Спаданням',
        filterBtn: 'Фільтри',
        filterBtnText: 'Фільтри',
        filterModalTitle: 'Фільтри',
        clearFilters: 'Очистити Все',
        applyFilters: 'Застосувати',
        favoritesModalTitle: 'Зберегти Улюблене',
        favoritesModalDesc: 'Введіть своє ім\'я, щоб зберегти 4 улюблені (по одному з категорії).',
        favoritesNamePlaceholder: 'Ваше ім\'я',
        viewFavoritesTitle: 'Ваші Улюблені',
        cancel: 'Скасувати',
        save: 'Зберегти',
        noResults: 'Результатів не знайдено',
        noFavorites: 'Улюблене не збережено',
        character: 'Персонаж',
        spell: 'Закляття',
        house: 'Факультет',
        book: 'Книга',
        houseLabel: 'Факультет',
        hasChildren: 'Має Дітей',
        yes: 'Так',
        no: 'Ні',
        useContains: 'Використання Містить',
        minPages: 'Мін Сторінок',
        maxPages: 'Макс Сторінок',
        founder: 'Засновник',
        colors: 'Кольори',
        animal: 'Тварина',
        interpretedBy: 'Грає',
        birthdate: 'Дата Народження',
        children: 'Діти',
        releaseDate: 'Дата Випуску',
        pages: 'Сторінок',
        description: 'Опис',
        use: 'Використання',
        spellName: 'Закляття',
        originalTitle: 'Оригінальна Назва',
        cover: 'Обкладинка',
        nickname: 'Прізвисько',
        fullName: 'Повне Ім\'я',
        index: 'Індекс',
        errorLoading: 'Помилка завантаження. Спробуйте ще раз.',
        favoritesSaved: 'Улюблене збережено успішно!',
        favoritesLoadError: 'Помилка завантаження улюбленого',
        nameRequired: 'Будь ласка, введіть своє ім\'я',
        selectCategory: 'Оберіть хоча б одну категорію',
        favoriteExists: 'Це улюблене вже існує',
        viewFavorites: 'Переглянути Улюблене',
        addToFavorites: 'Додати до Улюбленого',
        removeFromFavorites: 'Видалити з Улюбленого',
        noFiltersAvailable: 'Немає доступних фільтрів для Факультетів',
        userName: 'Ім\'я'
    }
};

let currentLang = 'en';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        applyTranslations();
        return true;
    }
    return false;
}

export function getCurrentLanguage() {
    return currentLang;
}

export function t(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update language button
    updateLanguageButton();
}

function updateLanguageButton() {
    const flags = {
        en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', it: '🇮🇹', pt: '🇵🇹', uk: '🇺🇦'
    };
    const names = {
        en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', pt: 'Português', uk: 'Українська'
    };
    
    const flagEl = document.getElementById('currentLangFlag');
    const nameEl = document.getElementById('currentLangName');
    
    if (flagEl) flagEl.textContent = flags[currentLang] || '🇬🇧';
    if (nameEl) nameEl.textContent = names[currentLang] || 'English';
}

export function initializeI18n() {
    applyTranslations();
    
    // Language dropdown
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('opacity-0');
            langDropdown.classList.toggle('invisible');
            langDropdown.classList.toggle('translate-y-2');
        });
        
        document.addEventListener('click', () => {
            langDropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
        });
        
        langDropdown.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
                langDropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
                
                // Dispatch language change event
                window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
            });
        });
    }
}