/**
 * Sistema de Gestão - Oficina Mecânica
 * Arquivo principal da aplicação
 * 
 * @author Seu Nome
 * @version 1.0.0
 */

// Classe principal da aplicação
class OficinaApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.isLoading = false;
        this.notifications = [];
        
        // Bind dos métodos
        this.init = this.init.bind(this);
        this.showTab = this.showTab.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.updateCurrentDate = this.updateCurrentDate.bind(this);
        
        // Inicializar quando DOM estiver carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.init);
        } else {
            this.init();
        }
    }
    
    /**
     * Inicialização da aplicação
     */
    async init() {
        try {
            console.log('🔧 Iniciando Sistema de Gestão - Oficina Mecânica');
            
            this.showLoading();
            
            // Configurar eventos
            this.setupEventListeners();
            
            // Atualizar data atual
            this.updateCurrentDate();
            setInterval(this.updateCurrentDate, 60000); // Atualizar a cada minuto
            
            // Inicializar módulos
            await this.initializeModules();
            
            // Carregar dados iniciais
            await this.loadInitialData();
            
            // Mostrar tab inicial
            this.showTab('dashboard');
            
            // Esconder loading
            setTimeout(() => {
                this.hideLoading();
                this.showNotification('Sistema carregado com sucesso!', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.hideLoading();
            this.showNotification('Erro ao carregar o sistema', 'error');
        }
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Navegação por tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
        
        // Atalhos do teclado
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Resize da janela
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        
        // Antes de sair da página
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Clique fora de modais
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        
        // Formulários - prevenir submit padrão
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });
    }
    
    /**
     * Inicializar módulos da aplicação
     */
    async initializeModules() {
        try {
            // Verificar se os módulos existem antes de inicializar
            const modules = [
                { name: 'Dashboard', instance: window.dashboardModule },
                { name: 'Clientes', instance: window.clientesModule },
                { name: 'Veículos', instance: window.veiculosModule },
                { name: 'Serviços', instance: window.servicosModule },
                { name: 'Estoque', instance: window.estoqueModule },
                { name: 'Notas Fiscais', instance: window.notasModule },
                { name: 'Vendas', instance: window.vendasModule }
            ];
            
            for (const module of modules) {
                if (module.instance && typeof module.instance.init === 'function') {
                    await module.instance.init();
                    console.log(`✅ Módulo ${module.name} inicializado`);
                } else {
                    console.warn(`⚠️ Módulo ${module.name} não encontrado`);
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar módulos:', error);
            throw error;
        }
    }
    
    /**
     * Carregar dados iniciais
     */
    async loadInitialData() {
        try {
            // Verificar se há dados no localStorage
            const hasData = StorageManager.has(STORAGE_KEYS.CLIENTES) ||
                           StorageManager.has(STORAGE_KEYS.VEICULOS) ||
                           StorageManager.has(STORAGE_KEYS.SERVICOS);
            
            if (!hasData) {
                console.log('📦 Carregando dados de exemplo...');
                await this.loadSampleData();
            }
            
            // Atualizar contadores do dashboard
            if (window.dashboardModule) {
                window.dashboardModule.updateStats();
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
        }
    }
    
    /**
     * Carregar dados de exemplo
     */
    async loadSampleData() {
        // Dados de exemplo - Clientes
        const sampleClientes = [
            {
                id: generateId(),
                nome: 'João Silva Santos',
                cpf: '123.456.789-00',
                telefone: '(11) 99999-1234',
                email: 'joao@email.com',
                endereco: 'Rua das Flores, 123 - São Paulo/SP',
                dataCadastro: new Date().toISOString(),
                ativo: true
            },
            {
                id: generateId(),
                nome: 'Maria Oliveira Costa',
                cpf: '987.654.321-00',
                telefone: '(11) 88888-5678',
                email: 'maria@email.com',
                endereco: 'Av. Paulista, 456 - São Paulo/SP',
                dataCadastro: new Date().toISOString(),
                ativo: true
            }
        ];
        
        // Dados de exemplo - Veículos
        const sampleVeiculos = [
            {
                id: generateId(),
                clienteId: sampleClientes[0].id,
                placa: 'ABC-1234',
                marca: 'Toyota',
                modelo: 'Corolla',
                ano: 2020,
                cor: 'Prata',
                km: 45000,
                dataCadastro: new Date().toISOString()
            },
            {
                id: generateId(),
                clienteId: sampleClientes[1].id,
                placa: 'XYZ-9876',
                marca: 'Honda',
                modelo: 'Civic',
                ano: 2019,
                cor: 'Branco',
                km: 38000,
                dataCadastro: new Date().toISOString()
            }
        ];
        
        // Dados de exemplo - Produtos
        const sampleProdutos = [
            {
                id: generateId(),
                codigo: 'FL001',
                nome: 'Filtro de Óleo',
                categoria: 'filtros',
                fornecedor: 'Auto Peças ABC',
                quantidade: 25,
                estoqueMinimo: 10,
                precoCusto: 15.50,
                precoVenda: 25.00,
                dataCadastro: new Date().toISOString()
            },
            {
                id: generateId(),
                codigo: 'OL001',
                nome: 'Óleo Motor 5W30',
                categoria: 'oleos',
                fornecedor: 'Distribuidora XYZ',
                quantidade: 15,
                estoqueMinimo: 8,
                precoCusto: 35.00,
                precoVenda: 55.00,
                dataCadastro: new Date().toISOString()
            }
        ];
        
        // Salvar dados no localStorage
        StorageManager.set(STORAGE_KEYS.CLIENTES, sampleClientes);
        StorageManager.set(STORAGE_KEYS.VEICULOS, sampleVeiculos);
        StorageManager.set(STORAGE_KEYS.PRODUTOS, sampleProdutos);
        
        console.log('✅ Dados de exemplo carregados');
    }
    
    /**
     * Mostrar/ocultar tabs
     */
    showTab(tabName) {
        if (this.isLoading) return;
        
        try {
            // Remover classe active de todas as tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Adicionar classe active na tab selecionada
            const activeNavTab = document.querySelector(`[data-tab="${tabName}"]`);
            const activeContent = document.getElementById(tabName);
            
            if (activeNavTab && activeContent) {
                activeNavTab.classList.add('active');
                activeContent.classList.add('active');
                this.currentTab = tabName;
                
                // Executar função específica do módulo se existir
                const moduleFunction = `load${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
                if (window[moduleFunction] && typeof window[moduleFunction] === 'function') {
                    window[moduleFunction]();
                }
                
                // Salvar tab atual no localStorage
                localStorage.setItem('currentTab', tabName);
                
                console.log(`📋 Tab ativa: ${tabName}`);
            } else {
                console.warn(`⚠️ Tab não encontrada: ${tabName}`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao trocar tab:', error);
            this.showNotification('Erro ao carregar seção', 'error');
        }
    }
    
    /**
     * Atualizar data atual no header
     */
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateElement.textContent = now.toLocaleDateString('pt-BR', options);
        }
    }
    
    /**
     * Mostrar loading
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
            this.isLoading = true;
        }
    }
    
    /**
     * Esconder loading
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
            this.isLoading = false;
        }
    }
    
    /**
     * Mostrar notificação
     */
    showNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        const id = generateId();
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-id', id);
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="app.closeNotification('${id}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress"></div>
        `;
        
        container.appendChild(notification);
        
        // Animar barra de progresso
        const progressBar = notification.querySelector('.notification-progress');
        setTimeout(() => {
            progressBar.style.width = '0%';
            progressBar.style.transition = `width ${duration}ms linear`;
        }, 100);
        
        // Auto remover
        setTimeout(() => {
            this.closeNotification(id);
        }, duration);
        
        // Adicionar à lista
        this.notifications.push({ id, element: notification, type, message });
    }
    
    /**
     * Fechar notificação
     */
    closeNotification(id) {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
            
            // Remover da lista
            this.notifications = this.notifications.filter(n => n.id !== id);
        }
    }
    
    /**
     * Lidar com atalhos do teclado
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + tecla
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.showTab('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.showTab('clientes');
                    break;
                case '3':
                    e.preventDefault();
                    this.showTab('veiculos');
                    break;
                case '4':
                    e.preventDefault();
                    this.showTab('servicos');
                    break;
                case '5':
                    e.preventDefault();
                    this.showTab('estoque');
                    break;
                case 's':
                    e.preventDefault();
                    // Salvar dados
                    this.saveAllData();
                    break;
            }
        }
        
        // ESC para fechar modais
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                modal.classList.remove('show');
            });
        }
    }
    
    /**
     * Lidar com redimensionamento da janela
     */
    handleWindowResize() {
        // Reajustar gráficos se existirem
        if (window.dashboardModule && window.dashboardModule.resizeCharts) {
            window.dashboardModule.resizeCharts();
        }
        
        // Reajustar tabelas responsivas
        this.adjustResponsiveTables();
    }
    
    /**
     * Lidar com saída da página
     */
    handleBeforeUnload(e) {
        // Salvar dados antes de sair
        this.saveAllData();
        
        // Se houver alterações não salvas, perguntar
        const hasUnsavedChanges = this.checkUnsavedChanges();
        if (hasUnsavedChanges) {
            const message = 'Há alterações não salvas. Deseja sair mesmo assim?';
            e.returnValue = message;
            return message;
        }
    }
    
    /**
     * Lidar com cliques fora de elementos
     */
    handleOutsideClick(e) {
        // Fechar dropdowns
        const dropdowns = document.querySelectorAll('.dropdown.active');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Fechar modais se clicar no backdrop
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    }
    
    /**
     * Lidar com submissão de formulários
     */
    handleFormSubmit(e) {
        const form = e.target;
        const formType = form.getAttribute('data-form-type');
        
        if (formType) {
            // Delegar para o módulo apropriado
            const moduleName = formType + 'Module';
            if (window[moduleName] && window[moduleName].handleFormSubmit) {
                window[moduleName].handleFormSubmit(e);
            }
        }
    }
    
    /**
     * Ajustar tabelas responsivas
     */
    adjustResponsiveTables() {
        const tables = document.querySelectorAll('.table-container');
        tables.forEach(container => {
            const table = container.querySelector('table');
            if (table) {
                // Adicionar scroll horizontal se necessário
                if (table.offsetWidth > container.offsetWidth) {
                    container.style.overflowX = 'auto';
                } else {
                    container.style.overflowX = 'visible';
                }
            }
        });
    }
    
    /**
     * Salvar todos os dados
     */
    saveAllData() {
        try {
            // Cada módulo deve ter sua própria função de save
            const modules = [
                window.clientesModule,
                window.veiculosModule,
                window.servicosModule,
                window.estoqueModule,
                window.notasModule,
                window.vendasModule
            ];
            
            modules.forEach(module => {
                if (module && typeof module.save === 'function') {
                    module.save();
                }
            });
            
            console.log('💾 Dados salvos');
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }
    
    /**
     * Verificar alterações não salvas
     */
    checkUnsavedChanges() {
        // Implementar lógica para verificar alterações não salvas
        // Por exemplo, comparar dados atuais com dados salvos
        return false; // Simplificado por enquanto
    }
    
    /**
     * Exportar dados para backup
     */
    exportData() {
        try {
            const data = {
                clientes: StorageManager.get(STORAGE_KEYS.CLIENTES, []),
                veiculos: StorageManager.get(STORAGE_KEYS.VEICULOS, []),
                servicos: StorageManager.get(STORAGE_KEYS.SERVICOS, []),
                produtos: StorageManager.get(STORAGE_KEYS.PRODUTOS, []),
                vendas: StorageManager.get(STORAGE_KEYS.VENDAS, []),
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `oficina-backup-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Backup exportado com sucesso!', 'success');
            
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            this.showNotification('Erro ao exportar dados', 'error');
        }
    }
    
    /**
     * Importar dados de backup
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validar estrutura dos dados
                    if (!this.validateBackupData(data)) {
                        throw new Error('Formato de backup inválido');
                    }
                    
                    // Fazer backup dos dados atuais
                    this.createBackupBeforeImport();
                    
                    // Importar dados
                    if (data.clientes) StorageManager.set(STORAGE_KEYS.CLIENTES, data.clientes);
                    if (data.veiculos) StorageManager.set(STORAGE_KEYS.VEICULOS, data.veiculos);
                    if (data.servicos) StorageManager.set(STORAGE_KEYS.SERVICOS, data.servicos);
                    if (data.produtos) StorageManager.set(STORAGE_KEYS.PRODUTOS, data.produtos);
                    if (data.vendas) StorageManager.set(STORAGE_KEYS.VENDAS, data.vendas);
                    
                    // Recarregar dados nos módulos
                    this.reloadAllModules();
                    
                    this.showNotification('Dados importados com sucesso!', 'success');
                    resolve(data);
                    
                } catch (error) {
                    console.error('❌ Erro ao importar dados:', error);
                    this.showNotification('Erro ao importar dados: ' + error.message, 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Validar dados de backup
     */
    validateBackupData(data) {
        // Verificar se tem estrutura básica
        if (!data || typeof data !== 'object') return false;
        
        // Verificar se tem pelo menos um dos arrays principais
        const requiredFields = ['clientes', 'veiculos', 'servicos', 'produtos'];
        return requiredFields.some(field => Array.isArray(data[field]));
    }
    
    /**
     * Criar backup antes da importação
     */
    createBackupBeforeImport() {
        const timestamp = new Date().toISOString();
        const currentData = {
            clientes: StorageManager.get(STORAGE_KEYS.CLIENTES, []),
            veiculos: StorageManager.get(STORAGE_KEYS.VEICULOS, []),
            servicos: StorageManager.get(STORAGE_KEYS.SERVICOS, []),
            produtos: StorageManager.get(STORAGE_KEYS.PRODUTOS, []),
            vendas: StorageManager.get(STORAGE_KEYS.VENDAS, []),
            backupDate: timestamp
        };
        
        localStorage.setItem('backup_before_import', JSON.stringify(currentData));
        console.log('💾 Backup automático criado antes da importação');
    }
    
    /**
     * Recarregar todos os módulos
     */
    reloadAllModules() {
        const modules = [
            window.dashboardModule,
            window.clientesModule,
            window.veiculosModule,
            window.servicosModule,
            window.estoqueModule,
            window.notasModule,
            window.vendasModule
        ];
        
        modules.forEach(module => {
            if (module && typeof module.reload === 'function') {
                module.reload();
            }
        });
        
        // Recarregar tab atual
        this.showTab(this.currentTab);
    }
    
    /**
     * Limpar todos os dados (com confirmação)
     */
    async clearAllData() {
        const confirmed = await this.showConfirmDialog(
            'Limpar Todos os Dados',
            'Esta ação irá remover todos os dados do sistema. Tem certeza que deseja continuar?',
            'warning'
        );
        
        if (confirmed) {
            try {
                // Criar backup antes de limpar
                this.exportData();
                
                // Limpar localStorage
                Object.values(STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                
                // Recarregar aplicação
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
                this.showNotification('Todos os dados foram removidos', 'success');
                
            } catch (error) {
                console.error('❌ Erro ao limpar dados:', error);
                this.showNotification('Erro ao limpar dados', 'error');
            }
        }
    }
    
    /**
     * Mostrar diálogo de confirmação
     */
    showConfirmDialog(title, message, type = 'info') {
        return new Promise((resolve) => {
            // Usar SweetAlert2 se disponível, senão usar confirm nativo
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: title,
                    text: message,
                    icon: type,
                    showCancelButton: true,
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: type === 'warning' ? '#f39c12' : '#3498db'
                }).then((result) => {
                    resolve(result.isConfirmed);
                });
            } else {
                resolve(confirm(`${title}\n\n${message}`));
            }
        });
    }
    
    /**
     * Obter informações do sistema
     */
    getSystemInfo() {
        return {
            version: '1.0.0',
            buildDate: '2024-01-15',
            browser: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            storage: this.getStorageInfo(),
            modules: this.getModulesInfo()
        };
    }
    
    /**
     * Obter informações de armazenamento
     */
    getStorageInfo() {
        const info = {};
        
        Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
            const data = StorageManager.get(storageKey, []);
            info[key.toLowerCase()] = {
                count: Array.isArray(data) ? data.length : 0,
                size: new Blob([JSON.stringify(data)]).size
            };
        });
        
        return info;
    }
    
    /**
     * Obter informações dos módulos
     */
    getModulesInfo() {
        const modules = [
            { name: 'Dashboard', instance: window.dashboardModule },
            { name: 'Clientes', instance: window.clientesModule },
            { name: 'Veículos', instance: window.veiculosModule },
            { name: 'Serviços', instance: window.servicosModule },
            { name: 'Estoque', instance: window.estoqueModule },
            { name: 'Notas Fiscais', instance: window.notasModule },
            { name: 'Vendas', instance: window.vendasModule }
        ];
        
        return modules.map(module => ({
            name: module.name,
            loaded: !!module.instance,
            initialized: !!(module.instance && module.instance.initialized)
        }));
    }
}

// Funções globais de utilitário
window.app = null;

// Funções expostas globalmente para compatibilidade
window.showTab = function(tabName) {
    if (window.app) {
        window.app.showTab(tabName);
    }
};

window.showNotification = function(message, type, duration) {
    if (window.app) {
        window.app.showNotification(message, type, duration);
    }
};

window.exportData = function() {
    if (window.app) {
        window.app.exportData();
    }
};

// Event Handlers globais para elementos HTML
window.novoCliente = function() {
    if (window.clientesModule && window.clientesModule.novo) {
        window.clientesModule.novo();
    }
};

window.novoVeiculo = function() {
    if (window.veiculosModule && window.veiculosModule.novo) {
        window.veiculosModule.novo();
    }
};

window.novaOS = function() {
    if (window.servicosModule && window.servicosModule.nova) {
        window.servicosModule.nova();
    }
};

window.novoProduto = function() {
    if (window.estoqueModule && window.estoqueModule.novo) {
        window.estoqueModule.novo();
    }
};

window.novaVenda = function() {
    if (window.vendasModule && window.vendasModule.nova) {
        window.vendasModule.nova();
    }
};

window.atualizarDashboard = function() {
    if (window.dashboardModule && window.dashboardModule.updateStats) {
        window.dashboardModule.updateStats();
        window.app.showNotification('Dashboard atualizado!', 'success');
    }
};

// Filtros globais
window.filtrarClientes = function() {
    if (window.clientesModule && window.clientesModule.filtrar) {
        window.clientesModule.filtrar();
    }
};

window.filtrarVeiculos = function() {
    if (window.veiculosModule && window.veiculosModule.filtrar) {
        window.veiculosModule.filtrar();
    }
};

window.filtrarServicos = function() {
    if (window.servicosModule && window.servicosModule.filtrar) {
        window.servicosModule.filtrar();
    }
};

window.filtrarEstoque = function() {
    if (window.estoqueModule && window.estoqueModule.filtrar) {
        window.estoqueModule.filtrar();
    }
};

// Formulários - Limpar
window.limparFormCliente = function() {
    document.getElementById('formCliente')?.reset();
};

window.limparFormVeiculo = function() {
    document.getElementById('formVeiculo')?.reset();
};

window.limparFormServico = function() {
    document.getElementById('formServico')?.reset();
};

window.limparFormProduto = function() {
    document.getElementById('formProduto')?.reset();
};

// Debug helpers
window.debugApp = function() {
    if (window.app) {
        console.log('🔍 Informações do Sistema:', window.app.getSystemInfo());
        console.log('📊 Dados Armazenados:', window.app.getStorageInfo());
        console.log('🔧 Módulos:', window.app.getModulesInfo());
    }
};

window.clearData = function() {
    if (window.app) {
        window.app.clearAllData();
    }
};

// Service Worker registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch((error) => {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// Error handling global
window.addEventListener('error', (e) => {
    console.error('❌ Erro global capturado:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    if (window.app) {
        window.app.showNotification('Ocorreu um erro inesperado', 'error');
    }
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rejeitada:', e.reason);
    
    if (window.app) {
        window.app.showNotification('Erro na operação', 'error');
    }
    
    e.preventDefault();
});

// Inicializar aplicação quando script carregar
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OficinaApp();
});

// Se DOM já estiver carregado
if (document.readyState !== 'loading') {
    window.app = new OficinaApp();
}

console.log('🚀 Sistema de Gestão - Oficina Mecânica carregado');