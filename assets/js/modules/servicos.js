// Módulo de Gerenciamento de Serviços
class ServicosManager {
    constructor() {
        this.servicos = JSON.parse(localStorage.getItem('servicos')) || [];
        this.servicoAtual = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadServicos();
    }

    bindEvents() {
        // Botão Novo Serviço
        const btnNovoServico = document.getElementById('btn-novo-servico');
        if (btnNovoServico) {
            btnNovoServico.addEventListener('click', () => this.abrirModal());
        }

        // Botão Salvar Serviço
        document.addEventListener('click', (e) => {
            if (e.target.id === 'salvarServico') {
                this.salvarServico();
            }
        });

        // Filtros e busca
        const searchInput = document.getElementById('search-servico');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filtrarServicos());
        }

        const filterCategoria = document.getElementById('filter-categoria');
        if (filterCategoria) {
            filterCategoria.addEventListener('change', () => this.filtrarServicos());
        }

        // Modal events
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('servicoModal');
            if (modal) {
                modal.addEventListener('hidden.bs.modal', () => this.limparForm());
            }
        });
    }

    abrirModal(servico = null) {
        this.servicoAtual = servico;
        const modal = new bootstrap.Modal(document.getElementById('servicoModal'));
        
        if (servico) {
            this.preencherForm(servico);
            document.getElementById('servicoModalLabel').textContent = 'Editar Serviço';
        } else {
            this.limparForm();
            document.getElementById('servicoModalLabel').textContent = 'Novo Serviço';
        }
        
        modal.show();
    }

    preencherForm(servico) {
        document.getElementById('nomeServico').value = servico.nome || '';
        document.getElementById('categoriaServico').value = servico.categoria || '';
        document.getElementById('descricaoServico').value = servico.descricao || '';
        document.getElementById('valorServico').value = servico.valor || '';
        document.getElementById('tempoEstimado').value = servico.tempo || '';
        document.getElementById('statusServico').value = servico.status || 'ativo';
        document.getElementById('observacoesServico').value = servico.observacoes || '';
    }

    limparForm() {
        document.getElementById('servicoForm').reset();
        this.servicoAtual = null;
    }

    salvarServico() {
        const form = document.getElementById('servicoForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const servico = {
            id: this.servicoAtual ? this.servicoAtual.id : Date.now(),
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            descricao: formData.get('descricao'),
            valor: parseFloat(formData.get('valor')),
            tempo: parseFloat(formData.get('tempo')) || 0,
            status: formData.get('status'),
            observacoes: formData.get('observacoes'),
            dataCriacao: this.servicoAtual ? this.servicoAtual.dataCriacao : new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };

        if (this.servicoAtual) {
            const index = this.servicos.findIndex(s => s.id === this.servicoAtual.id);
            this.servicos[index] = servico;
        } else {
            this.servicos.push(servico);
        }

        this.salvarLocalStorage();
        this.loadServicos();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('servicoModal'));
        modal.hide();

        this.showNotification('Serviço salvo com sucesso!', 'success');
    }

    excluirServico(id) {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            this.servicos = this.servicos.filter(s => s.id !== id);
            this.salvarLocalStorage();
            this.loadServicos();
            this.showNotification('Serviço excluído com sucesso!', 'success');
        }
    }

    loadServicos() {
        const tbody = document.getElementById('servicos-table-body');
        if (!tbody) return;

        if (this.servicos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-tools fa-3x text-muted mb-3"></i>
                            <h5>Nenhum serviço cadastrado</h5>
                            <p class="text-muted">Clique em "Novo Serviço" para começar</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.servicos.map(servico => `
            <tr>
                <td>${servico.id}</td>
                <td>${servico.nome}</td>
                <td>${servico.descricao || '-'}</td>
                <td>R$ ${servico.valor.toFixed(2)}</td>
                <td>${servico.tempo}h</td>
                <td>
                    <span class="badge bg-${this.getCategoriaColor(servico.categoria)}">
                        ${this.getCategoriaLabel(servico.categoria)}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${servico.status === 'ativo' ? 'success' : 'secondary'}">
                        ${servico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="servicosManager.abrirModal(${JSON.stringify(servico).replace(/"/g, '&quot;')})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="servicosManager.excluirServico(${servico.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filtrarServicos() {
        const searchTerm = document.getElementById('search-servico').value.toLowerCase();
        const categoriaFilter = document.getElementById('filter-categoria').value;

        let servicosFiltrados = this.servicos;

        if (searchTerm) {
            servicosFiltrados = servicosFiltrados.filter(servico => 
                servico.nome.toLowerCase().includes(searchTerm) ||
                servico.descricao.toLowerCase().includes(searchTerm)
            );
        }

        if (categoriaFilter) {
            servicosFiltrados = servicosFiltrados.filter(servico => 
                servico.categoria === categoriaFilter
            );
        }

        this.renderServicos(servicosFiltrados);
    }

    renderServicos(servicos) {
        const tbody = document.getElementById('servicos-table-body');
        if (!tbody) return;

        if (servicos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-search fa-2x text-muted mb-2"></i>
                            <p class="text-muted">Nenhum serviço encontrado</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = servicos.map(servico => `
            <tr>
                <td>${servico.id}</td>
                <td>${servico.nome}</td>
                <td>${servico.descricao || '-'}</td>
                <td>R$ ${servico.valor.toFixed(2)}</td>
                <td>${servico.tempo}h</td>
                <td>
                    <span class="badge bg-${this.getCategoriaColor(servico.categoria)}">
                        ${this.getCategoriaLabel(servico.categoria)}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${servico.status === 'ativo' ? 'success' : 'secondary'}">
                        ${servico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="servicosManager.abrirModal(${JSON.stringify(servico).replace(/"/g, '&quot;')})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="servicosManager.excluirServico(${servico.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getCategoriaColor(categoria) {
        const colors = {
            'manutencao': 'primary',
            'revisao': 'info',
            'reparo': 'warning',
            'eletrica': 'success',
            'pintura': 'secondary',
            'funilaria': 'dark'
        };
        return colors[categoria] || 'secondary';
    }

    getCategoriaLabel(categoria) {
        const labels = {
            'manutencao': 'Manutenção',
            'revisao': 'Revisão',
            'reparo': 'Reparo',
            'eletrica': 'Elétrica',
            'pintura': 'Pintura',
            'funilaria': 'Funilaria'
        };
        return labels[categoria] || categoria;
    }

    salvarLocalStorage() {
        localStorage.setItem('servicos', JSON.stringify(this.servicos));
    }

    showNotification(message, type = 'info') {
        // Criar notificação toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remover após 3 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos foram carregados
    setTimeout(() => {
        window.servicosManager = new ServicosManager();
    }, 100);
});

// Exportar para uso global
window.ServicosManager = ServicosManager;