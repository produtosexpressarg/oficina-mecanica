/**
 * Módulo Dashboard
 * Sistema de Gestão - Oficina Mecânica
 */

class DashboardModule {
    constructor() {
        this.initialized = false;
        this.charts = {};
        this.updateInterval = null;
        
        // Cache de dados
        this.cache = {
            stats: null,
            lastUpdate: null
        };
        
        // Bind dos métodos
        this.init = this.init.bind(this);
        this.updateStats = this.updateStats.bind(this);
        this.loadServicosAndamento = this.loadServicosAndamento.bind(this);
        this.loadAlertasEstoque = this.loadAlertasEstoque.bind(this);
    }
    
    /**
     * Inicializar módulo
     */
    async init() {
        if (this.initialized) return;
        
        try {
            console.log('📊 Inicializando módulo Dashboard...');
            
            // Atualizar estatísticas
            await this.updateStats();
            
            // Carregar dados específicos
            await this.loadServicosAndamento();
            await this.loadAlertasEstoque();
            
            // Configurar auto-atualização
            this.startAutoUpdate();
            
            this.initialized = true;
            console.log('✅ Módulo Dashboard inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Dashboard:', error);
        }
    }
    
    /**
     * Atualizar estatísticas gerais
     */
    async updateStats() {
        try {
            // Verificar cache
            const now = Date.now();
            if (this.cache.stats && this.cache.lastUpdate && 
                (now - this.cache.lastUpdate) < CACHE_CONFIG.TTL) {
                this.displayStats(this.cache.stats);
                return;
            }
            
            // Buscar dados
            const clientes = StorageManager.get(STORAGE_KEYS.CLIENTES, []);
            const veiculos = StorageManager.get(STORAGE_KEYS.VEICULOS, []);
            const servicos = StorageManager.get(STORAGE_KEYS.SERVICOS, []);
            const vendas = StorageManager.get(STORAGE_KEYS.VENDAS, []);
            
            // Calcular estatísticas
            const stats = {
                totalClientes: clientes.length,
                clientesAtivos: clientes.filter(c => c.ativo).length,
                totalVeiculos: veiculos.length,
                totalServicos: servicos.length,
                servicosPendentes: servicos.filter(s => s.status === STATUS.SERVICO.PENDENTE).length,
                servicosAndamento: servicos.filter(s => s.status === STATUS.SERVICO.ANDAMENTO).length,
                servicosConcluidos: servicos.filter(s => s.status === STATUS.SERVICO.CONCLUIDO).length,
                totalVendas: this.calculateTotalVendas(vendas),
                vendasMes: this.calculateVendasMes(vendas),
                vendasHoje: this.calculateVendasHoje(vendas),
                ticketMedio: this.calculateTicketMedio(vendas),
                contasReceber: this.calculateContasReceber(vendas)
            };
            
            // Atualizar cache
            this.cache.stats = stats;
            this.cache.lastUpdate = now;
            
            // Exibir estatísticas
            this.displayStats(stats);
            
            // Criar/atualizar gráficos
            this.createCharts(stats);
            
        } catch (error) {
            console.error('❌ Erro ao atualizar estatísticas:', error);
        }
    }
    
    /**
     * Exibir estatísticas na interface
     */
    displayStats(stats) {
        const elements = {
            totalClientes: document.getElementById('totalClientes'),
            totalVeiculos: document.getElementById('totalVeiculos'),
            totalServicos: document.getElementById('totalServicos'),
            totalVendas: document.getElementById('totalVendas'),
            vendasHoje: document.getElementById('vendasHoje'),
            vendasMes: document.getElementById('vendasMes'),
            contasReceber: document.getElementById('contasReceber'),
            ticketMedio: document.getElementById('ticketMedio')
        };
        
        // Atualizar elementos com animação
        Object.entries(elements).forEach(([key, element]) => {
            if (element) {
                const value = stats[key];
                const isMonetary = ['totalVendas', 'vendasHoje', 'vendasMes', 'contasReceber', 'ticketMedio'].includes(key);
                
                if (isMonetary) {
                    this.animateNumber(element, parseFloat(element.textContent.replace(/[R$\s.,]/g, '') || 0), value, formatCurrency);
                } else {
                    this.animateNumber(element, parseInt(element.textContent || 0), value);
                }
            }
        });
    }
    
    /**
     * Animar números com contagem progressiva
     */
    animateNumber(element, from, to, formatter = null) {
        const duration = 1000; // 1 segundo
        const steps = 50;
        const increment = (to - from) / steps;
        const stepDuration = duration / steps;
        
        let current = from;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = to;
                clearInterval(timer);
            }
            
            const displayValue = formatter ? formatter(current) : Math.round(current).toString();
            element.textContent = displayValue;
        }, stepDuration);
    }
    
    /**
     * Calcular total de vendas
     */
    calculateTotalVendas(vendas) {
        return vendas
            .filter(v => v.status === STATUS.PAGAMENTO.PAGO)
            .reduce((total, venda) => total + (venda.valor || 0), 0);
    }
    
    /**
     * Calcular vendas do mês atual
     */
    calculateVendasMes(vendas) {
        const now = new Date();
        const mesAtual = now.getMonth();
        const anoAtual = now.getFullYear();
        
        return vendas
            .filter(v => {
                const dataVenda = new Date(v.data);
                return dataVenda.getMonth() === mesAtual && 
                       dataVenda.getFullYear() === anoAtual &&
                       v.status === STATUS.PAGAMENTO.PAGO;
            })
            .reduce((total, venda) => total + (venda.valor || 0), 0);
    }
    
    /**
     * Calcular vendas de hoje
     */
    calculateVendasHoje(vendas) {
        const hoje = new Date().toDateString();
        
        return vendas
            .filter(v => {
                const dataVenda = new Date(v.data).toDateString();
                return dataVenda === hoje && v.status === STATUS.PAGAMENTO.PAGO;
            })
            .reduce((total, venda) => total + (venda.valor || 0), 0);
    }
    
    /**
     * Calcular ticket médio
     */
    calculateTicketMedio(vendas) {
        const vendasPagas = vendas.filter(v => v.status === STATUS.PAGAMENTO.PAGO);
        if (vendasPagas.length === 0) return 0;
        
        const total = this.calculateTotalVendas(vendas);
        return total / vendasPagas.length;
    }
    
    /**
     * Calcular contas a receber
     */
    calculateContasReceber(vendas) {
        return vendas
            .filter(v => v.status === STATUS.PAGAMENTO.PENDENTE)
            .reduce((total, venda) => total + (venda.valor || 0), 0);
    }
    
    /**
     * Carregar serviços em andamento
     */
    async loadServicosAndamento() {
        try {
            const servicos = StorageManager.get(STORAGE_KEYS.SERVICOS, []);
            const clientes = StorageManager.get(STORAGE_KEYS.CLIENTES, []);
            const veiculos = StorageManager.get(STORAGE_KEYS.VEICULOS, []);
            
            const servicosAndamento = servicos.filter(s => 
                s.status === STATUS.SERVICO.ANDAMENTO || s.status === STATUS.SERVICO.PENDENTE
            );
            
            const container = document.getElementById('servicosAndamento');
            if (!container) return;
            
            if (servicosAndamento.length === 0) {
                container.innerHTML = '<p class="empty-state">Nenhum serviço em andamento no momento.</p>';
                return;
            }
            
            const html = servicosAndamento.slice(0, 5).map(servico => {
                const cliente = clientes.find(c => c.id === servico.clienteId);
                const veiculo = veiculos.find(v => v.id === servico.veiculoId);
                const statusClass = servico.status.toLowerCase();
                const diasAtraso = this.calculateDiasAtraso(servico.dataPrevista);
                
                return `
                    <div class="servico-item">
                        <div class="servico-info">
                            <div class="servico-numero">OS #${servico.numero}</div>
                            <div class="servico-cliente">${cliente?.nome || 'Cliente não encontrado'}</div>
                            <div class="servico-veiculo">${veiculo?.marca} ${veiculo?.modelo} - ${veiculo?.placa}</div>
                        </div>
                        <div class="servico-status">
                            <span class="status ${statusClass}">${this.getStatusLabel(servico.status)}</span>
                            ${diasAtraso > 0 ? `<span class="status-atraso">${diasAtraso} dias de atraso</span>` : ''}
                        </div>
                        <div class="servico-actions">
                            <button class="btn btn-sm" onclick="editarServico('${servico.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="concluirServico('${servico.id}')">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('❌ Erro ao carregar serviços em andamento:', error);
        }
    }
    
    /**
     * Carregar alertas de estoque
     */
    async loadAlertasEstoque() {
        try {
            const produtos = StorageManager.get(STORAGE_KEYS.PRODUTOS, []);
            
            const produtosBaixoEstoque = produtos.filter(p => 
                p.ativo && p.quantidade <= p.estoqueMinimo && p.quantidade > 0
            );
            
            const produtosZerados = produtos.filter(p => 
                p.ativo && p.quantidade === 0
            );
            
            const container = document.getElementById('alertasEstoque');
            if (!container) return;
            
            if (produtosBaixoEstoque.length === 0 && produtosZerados.length === 0) {
                container.innerHTML = '<p class="empty-state">Estoque em níveis normais.</p>';
                return;
            }
            
            let html = '';
            
            if (produtosZerados.length > 0) {
                html += `
                    <div class="alerta-grupo">
                        <h4 class="alerta-titulo text-danger">
                            <i class="fas fa-exclamation-circle"></i>
                            Produtos em Falta (${produtosZerados.length})
                        </h4>
                        ${produtosZerados.slice(0, 3).map(produto => `
                            <div class="alerta-item">
                                <div class="produto-info">
                                    <strong>${produto.codigo}</strong> - ${produto.nome}
                                    <span class="status zerado">Zerado</span>
                                </div>
                            </div>
                        `).join('')}
                        ${produtosZerados.length > 3 ? `<p class="text-muted">... e mais ${produtosZerados.length - 3} produtos</p>` : ''}
                    </div>
                `;
            }
            
            if (produtosBaixoEstoque.length > 0) {
                html += `
                    <div class="alerta-grupo">
                        <h4 class="alerta-titulo text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Estoque Baixo (${produtosBaixoEstoque.length})
                        </h4>
                        ${produtosBaixoEstoque.slice(0, 3).map(produto => `
                            <div class="alerta-item">
                                <div class="produto-info">
                                    <strong>${produto.codigo}</strong> - ${produto.nome}
                                    <span class="quantidade-atual">${produto.quantidade} unidades</span>
                                    <span class="status baixo">Baixo</span>
                                </div>
                            </div>
                        `).join('')}
                        ${produtosBaixoEstoque.length > 3 ? `<p class="text-muted">... e mais ${produtosBaixoEstoque.length - 3} produtos</p>` : ''}
                    </div>
                `;
            }
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('❌ Erro ao carregar alertas de estoque:', error);
        }
    }
    
    /**
     * Calcular dias de atraso
     */
    calculateDiasAtraso(dataPrevista) {
        if (!dataPrevista) return 0;
        
        const hoje = new Date();
        const prevista = new Date(dataPrevista);
        
        if (prevista >= hoje) return 0;
        
        const diffTime = hoje - prevista;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Obter label do status
     */
    getStatusLabel(status) {
        const labels = {
            [STATUS.SERVICO.PENDENTE]: 'Pendente',
            [STATUS.SERVICO.ANDAMENTO]: 'Em Andamento',
            [STATUS.SERVICO.CONCLUIDO]: 'Concluído',
            [STATUS.SERVICO.ENTREGUE]: 'Entregue',
            [STATUS.SERVICO.CANCELADO]: 'Cancelado'
        };
        
        return labels[status] || status;
    }
    
    /**
     * Criar gráficos do dashboard
     */
    createCharts(stats) {
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js não está disponível');
            return;
        }
        
        try {
            // Gráfico de status de serviços
            this.createServicosChart(stats);
            
            // Gráfico de vendas dos últimos meses
            this.createVendasChart();
            
            // Gráfico de distribuição de clientes
            this.createClientesChart(stats);
            
        } catch (error) {
            console.error('❌ Erro ao criar gráficos:', error);
        }
    }
    
    /**
     * Criar gráfico de status de serviços
     */
    createServicosChart(stats) {
        const canvas = document.getElementById('servicosChart');
        if (!canvas) return;
        
        // Destruir gráfico existente
        if (this.charts.servicos) {
            this.charts.servicos.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        
        this.charts.servicos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendentes', 'Em Andamento', 'Concluídos'],
                datasets: [{
                    data: [
                        stats.servicosPendentes,
                        stats.servicosAndamento,
                        stats.servicosConcluidos
                    ],
                    backgroundColor: [
                        SYSTEM_COLORS.WARNING,
                        SYSTEM_COLORS.PRIMARY,
                        SYSTEM_COLORS.SUCCESS
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    title: {
                        display: true,
                        text: 'Status dos Serviços',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Criar gráfico de vendas
     */
    createVendasChart() {
        const canvas = document.getElementById('vendasChart');
        if (!canvas) return;
        
        // Destruir gráfico existente
        if (this.charts.vendas) {
            this.charts.vendas.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        
        // Obter dados dos últimos 6 meses
        const vendasData = this.getVendasUltimosMeses(6);
        
        this.charts.vendas = new Chart(ctx, {
            type: 'line',
            data: {
                labels: vendasData.labels,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: vendasData.values,
                    borderColor: SYSTEM_COLORS.PRIMARY,
                    backgroundColor: SYSTEM_COLORS.PRIMARY + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: SYSTEM_COLORS.PRIMARY,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Vendas dos Últimos 6 Meses',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Criar gráfico de clientes
     */
    createClientesChart(stats) {
        const canvas = document.getElementById('clientesChart');
        if (!canvas) return;
        
        // Destruir gráfico existente
        if (this.charts.clientes) {
            this.charts.clientes.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        
        const clientesInativos = stats.totalClientes - stats.clientesAtivos;
        
        this.charts.clientes = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Ativos', 'Inativos'],
                datasets: [{
                    data: [stats.clientesAtivos, clientesInativos],
                    backgroundColor: [
                        SYSTEM_COLORS.SUCCESS,
                        SYSTEM_COLORS.DANGER
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Clientes',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Obter dados de vendas dos últimos meses
     */
    getVendasUltimosMeses(meses) {
        const vendas = StorageManager.get(STORAGE_KEYS.VENDAS, []);
        const labels = [];
        const values = [];
        
        const hoje = new Date();
        
        for (let i = meses - 1; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const mesNome = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            
            const vendasMes = vendas
                .filter(v => {
                    const dataVenda = new Date(v.data);
                    return dataVenda.getMonth() === data.getMonth() && 
                           dataVenda.getFullYear() === data.getFullYear() &&
                           v.status === STATUS.PAGAMENTO.PAGO;
                })
                .reduce((total, venda) => total + (venda.valor || 0), 0);
            
            labels.push(capitalize(mesNome));
            values.push(vendasMes);
        }
        
        return { labels, values };
    }
    
    /**
     * Redimensionar gráficos
     */
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
    
    /**
     * Iniciar auto-atualização
     */
    startAutoUpdate() {
        // Atualizar a cada 5 minutos
        this.updateInterval = setInterval(() => {
            this.updateStats();
            this.loadServicosAndamento();
            this.loadAlertasEstoque();
        }, 5 * 60 * 1000);
    }
    
    /**
     * Parar auto-atualização
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Recarregar módulo
     */
    async reload() {
        this.cache.stats = null;
        this.cache.lastUpdate = null;
        await this.updateStats();
        await this.loadServicosAndamento();
        await this.loadAlertasEstoque();
    }
    
    /**
     * Destruir módulo
     */
    destroy() {
        this.stopAutoUpdate();
        
        // Destruir gráficos
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        this.initialized = false;
    }
    
    /**
     * Exportar dados do dashboard
     */
    exportDashboardData() {
        const stats = this.cache.stats;
        if (!stats) return null;
        
        return {
            estatisticas: stats,
            vendasUltimosMeses: this.getVendasUltimosMeses(12),
            servicosAndamento: StorageManager.get(STORAGE_KEYS.SERVICOS, [])
                .filter(s => s.status === STATUS.SERVICO.ANDAMENTO),
            alertasEstoque: this.getAlertasEstoque(),
            dataExportacao: new Date().toISOString()
        };
    }
    
    /**
     * Obter alertas de estoque estruturados
     */
    getAlertasEstoque() {
        const produtos = StorageManager.get(STORAGE_KEYS.PRODUTOS, []);
        
        return {
            produtosZerados: produtos.filter(p => p.ativo && p.quantidade === 0),
            produtosBaixoEstoque: produtos.filter(p => 
                p.ativo && p.quantidade <= p.estoqueMinimo && p.quantidade > 0
            ),
            produtosVencendo: produtos.filter(p => {
                if (!p.dataValidade) return false;
                const hoje = new Date();
                const validade = new Date(p.dataValidade);
                const diffDays = (validade - hoje) / (1000 * 60 * 60 * 24);
                return diffDays <= 30 && diffDays > 0;
            })
        };
    }
}

// Funções globais para interação com HTML
window.editarServico = function(servicoId) {
    if (window.servicosModule && window.servicosModule.editar) {
        window.servicosModule.editar(servicoId);
        window.app.showTab('servicos');
    }
};

window.concluirServico = function(servicoId) {
    if (window.servicosModule && window.servicosModule.concluir) {
        window.servicosModule.concluir(servicoId);
    }
};

window.verProduto = function(produtoId) {
    if (window.estoqueModule && window.estoqueModule.ver) {
        window.estoqueModule.ver(produtoId);
        window.app.showTab('estoque');
    }
};

// Criar instância do módulo
window.dashboardModule = new DashboardModule();

console.log('📊 Módulo Dashboard carregado');