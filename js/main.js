// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('results');
    const loadingElement = document.getElementById('loading');
    const noResultsElement = document.getElementById('no-results');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Dados dos imóveis (simulando uma base de dados)
    let properties = [];

    // Inicialização
    init();

    function init() {
        loadProperties();
        setupEventListeners();
        setupMobileMenu();
        setupSmoothScroll();
    }

    // Carrega os dados dos imóveis
    async function loadProperties() {
        try {
            const response = await fetch('data/properties.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados dos imóveis');
            }
            properties = await response.json();
            displayProperties(properties);
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
            // Usar dados de fallback se não conseguir carregar o JSON
            properties = getFallbackProperties();
            displayProperties(properties);
        }
    }

    // Dados de fallback caso o JSON não carregue
    function getFallbackProperties() {
        return [
            {
                id: 1,
                titulo: "Apartamento de Luxo - Alphaville Residencial 1",
                tipo: "apartamento",
                objetivo: "moradia",
                preco: 1800000,
                localizacao: "Alphaville Residencial 1",
                quartos: 3,
                imagem: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Apartamento moderno com excelente localização, vista panorâmica e infraestrutura completa."
            },
            {
                id: 2,
                titulo: "Casa Exclusiva para Investimento - Alphaville Residencial 2",
                tipo: "casa",
                objetivo: "investimento",
                preco: 2500000,
                localizacao: "Alphaville Residencial 2",
                quartos: 4,
                imagem: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Residência espaçosa ideal para investimento com alto potencial de valorização."
            },
            {
                id: 3,
                titulo: "Casa em Condomínio - Alphaville Residencial 4",
                tipo: "casa-condominio",
                objetivo: "moradia",
                preco: 3200000,
                localizacao: "Alphaville Residencial 4",
                quartos: 5,
                imagem: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Casa em condomínio fechado com área de lazer completa e segurança 24h."
            },
            {
                id: 4,
                titulo: "Apartamento Compacto - Alphaville Centro Comercial",
                tipo: "apartamento",
                objetivo: "investimento",
                preco: 850000,
                localizacao: "Alphaville Centro Comercial",
                quartos: 2,
                imagem: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Apartamento compacto e moderno, ideal para investimento com alta demanda de locação."
            },
            {
                id: 5,
                titulo: "Terreno Premium - Alphaville Residencial 3",
                tipo: "terreno",
                objetivo: "investimento",
                preco: 1200000,
                localizacao: "Alphaville Residencial 3",
                quartos: 0,
                imagem: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Terreno em localização privilegiada, perfeito para construção de casa dos sonhos."
            },
            {
                id: 6,
                titulo: "Casa Moderna - Alphaville Residencial 5",
                tipo: "casa",
                objetivo: "moradia",
                preco: 4500000,
                localizacao: "Alphaville Residencial 5",
                quartos: 6,
                imagem: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800",
                descricao: "Casa moderna com arquitetura contemporânea, piscina e área gourmet."
            }
        ];
    }

    // Configura os event listeners
    function setupEventListeners() {
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }

        // Event listeners para filtros em tempo real (opcional)
        const filterElements = searchForm?.querySelectorAll('select');
        filterElements?.forEach(element => {
            element.addEventListener('change', handleFilterChange);
        });
    }

    // Manipula a busca de imóveis
    function handleSearch(event) {
        event.preventDefault();
        
        const formData = new FormData(searchForm);
        const filters = {
            objetivo: formData.get('objetivo'),
            tipo: formData.get('tipo'),
            preco: formData.get('preco'),
            quartos: formData.get('quartos')
        };

        // Validação básica
        if (!filters.objetivo || !filters.tipo) {
            alert('Por favor, selecione pelo menos o objetivo e o tipo de imóvel.');
            return;
        }

        showLoading();
        
        // Simula delay de busca para melhor UX
        setTimeout(() => {
            const filteredProperties = filterProperties(filters);
            displayProperties(filteredProperties);
            hideLoading();
            
            // Scroll suave para os resultados
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    }

    // Manipula mudanças nos filtros (busca em tempo real)
    function handleFilterChange() {
        const formData = new FormData(searchForm);
        const filters = {
            objetivo: formData.get('objetivo'),
            tipo: formData.get('tipo'),
            preco: formData.get('preco'),
            quartos: formData.get('quartos')
        };

        // Só filtra se pelo menos objetivo e tipo estiverem selecionados
        if (filters.objetivo && filters.tipo) {
            const filteredProperties = filterProperties(filters);
            displayProperties(filteredProperties);
        }
    }

    // Filtra propriedades baseado nos critérios
    function filterProperties(filters) {
        return properties.filter(property => {
            // Filtro por objetivo
            if (filters.objetivo && property.objetivo !== filters.objetivo) {
                return false;
            }

            // Filtro por tipo
            if (filters.tipo && property.tipo !== filters.tipo) {
                return false;
            }

            // Filtro por preço
            if (filters.preco) {
                const maxPrice = parseInt(filters.preco);
                if (maxPrice === 5000001) { // Acima de 5 milhões
                    if (property.preco <= 5000000) return false;
                } else {
                    if (property.preco > maxPrice) return false;
                }
            }

            // Filtro por quartos
            if (filters.quartos) {
                const minQuartos = parseInt(filters.quartos);
                if (property.quartos < minQuartos) return false;
            }

            return true;
        });
    }

    // Exibe as propriedades na tela
    function displayProperties(propertiesToShow) {
        if (!resultsContainer) return;

        if (propertiesToShow.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();
        
        resultsContainer.innerHTML = propertiesToShow.map(property => `
            <div class="property-card" data-id="${property.id}">
                <img src="${property.imagem}" alt="${property.titulo}" class="property-image" loading="lazy">
                <div class="property-content">
                    <h3 class="property-title">${property.titulo}</h3>
                    <div class="property-price">R$ ${formatPrice(property.preco)}</div>
                    <div class="property-details">
                        <span>${property.quartos > 0 ? property.quartos + ' quartos' : 'Terreno'}</span>
                        <span>•</span>
                        <span>${property.localizacao}</span>
                    </div>
                    <p class="property-description">${property.descricao}</p>
                    <div class="property-tags">
                        <span class="tag">${formatObjective(property.objetivo)}</span>
                        <span class="tag">${formatType(property.tipo)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona event listeners para os cards
        addPropertyCardListeners();
    }

    // Adiciona listeners para os cards de propriedades
    function addPropertyCardListeners() {
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            card.addEventListener('click', () => {
                const propertyId = card.dataset.id;
                showPropertyDetails(propertyId);
            });
        });
    }

    // Mostra detalhes da propriedade (pode ser expandido para modal)
    function showPropertyDetails(propertyId) {
        const property = properties.find(p => p.id == propertyId);
        if (property) {
            // Por enquanto, apenas redireciona para WhatsApp
            const message = `Olá Vinicius! Tenho interesse no imóvel: ${property.titulo} - R$ ${formatPrice(property.preco)}`;
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    // Funções de utilidade para formatação
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR').format(price);
    }

    function formatObjective(objective) {
        const objectives = {
            'investimento': 'Investimento',
            'moradia': 'Moradia'
        };
        return objectives[objective] || objective;
    }

    function formatType(type) {
        const types = {
            'apartamento': 'Apartamento',
            'casa': 'Casa',
            'casa-condominio': 'Casa em Condomínio',
            'terreno': 'Terreno'
        };
        return types[type] || type;
    }

    // Funções de controle de UI
    function showLoading() {
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        hideNoResults();
    }

    function hideLoading() {
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    function showNoResults() {
        if (noResultsElement) {
            noResultsElement.classList.remove('hidden');
        }
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    function hideNoResults() {
        if (noResultsElement) {
            noResultsElement.classList.add('hidden');
        }
    }

    // Configuração do menu mobile
    function setupMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Fecha o menu ao clicar em um link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    }

    // Configuração de scroll suave
    function setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Animações de scroll (opcional)
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observa elementos que devem ser animados
        const animatedElements = document.querySelectorAll('.feature, .property-card, .stat');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Chama as animações se necessário
    setupScrollAnimations();

    // Função para lidar com erros de imagem
    function handleImageError(img) {
        img.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800';
        img.alt = 'Imagem não disponível';
    }

    // Adiciona tratamento de erro para todas as imagens
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            handleImageError(e.target);
        }
    }, true);

    // Função para validar formulário
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.get('objetivo')) {
            errors.push('Selecione o objetivo (Investimento ou Moradia)');
        }
        
        if (!formData.get('tipo')) {
            errors.push('Selecione o tipo de imóvel');
        }
        
        return errors;
    }

    // Função para mostrar mensagens de erro
    function showErrors(errors) {
        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
            return true;
        }
        return false;
    }

    // Função para analytics (pode ser expandida)
    function trackEvent(eventName, properties = {}) {
        // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
        console.log('Event tracked:', eventName, properties);
    }

    // Exposição de funções globais se necessário
    window.ViniciusRealEstate = {
        searchProperties: filterProperties,
        displayProperties: displayProperties,
        trackEvent: trackEvent
    };
});

// Adiciona estilos CSS para animações via JavaScript
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--primary-color);
        padding: 1rem;
        box-shadow: var(--shadow);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);
