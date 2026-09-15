/**
 * Sistema de Gestão - Oficina Mecânica
 * Aplicação principal
 */
class OficinaApp {
    constructor() {
        console.log('🔧 Inicializando Sistema de Gestão - Oficina Mecânica');
    }

    /**
     * Inicialização da aplicação
     */
    async init() {
        try {
            console.log('🔧 Iniciando Sistema de Gestão - Oficina Mecânica');
            
            // Configurar eventos básicos
            this.setupEventListeners();
            
            // Atualizar data atual
            this.updateCurrentDate();
            
            console.log('✅ Sistema inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema:', error);
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Navegação por tabs
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        });

        // Atualizar data a cada minuto
        setInterval(() => {
            this.updateCurrentDate();
        }, 60000);
    }

    /**
     * Atualizar data atual
     */
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('pt-BR', options);
        }
    }

    /**
     * Exibir notificação
     */
    showNotification(message, type = 'info', duration = 5000) {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OficinaApp();
    window.app.init();
});

console.log('🚀 Sistema de Gestión - Taller Mecánico cargado');