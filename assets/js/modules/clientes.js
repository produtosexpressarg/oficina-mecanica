/**
 * Módulo Clientes
 * Sistema de Gestão - Oficina Mecânica
 */

class ClientesModule {
    constructor() {
        this.initialized = false;
        this.clientes = [];
        this.filtroAtual = 'todos';
        this.termoBusca = '';
        
        // Elementos DOM
        this.elements = {
            tabelaClientes: document.getElementById('tabelaClientes'),
            searchInput: document.getElementById('searchClientes'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            btnNovoCliente: document.querySelector('.btn-success'),
            modalCliente: null
        };
    }
    
    /**
     * Inicializa o módulo
     */
    init() {
        if (this.initialized) return;
        
        // Carregar modal de cliente
        fetch('../components/modals/cliente-modal.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                this.elements.modalCliente = document.getElementById('clienteModal');
                this.configurarModal();
            });
        
        // Carregar dados iniciais
        this.carregarClientes();
        
        // Configurar eventos
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', this.buscarClientes);
        }
        
        if (this.elements.filterButtons) {
            this.elements.filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filtroAtual = btn.dataset.filter;
                    this.filtrarClientes();
                });
            });
        }
        
        if (this.elements.btnNovoCliente) {
            this.elements.btnNovoCliente.addEventListener('click', () => this.abrirModalCliente());
        }
        
        this.initialized = true;
    }
    
    /**
     * Configura os eventos do modal
     */
    configurarModal() {
        if (!this.elements.modalCliente) return;
        
        const btnSalvar = this.elements.modalCliente.querySelector('#salvarCliente');
        const btnFechar = this.elements.modalCliente.querySelector('.close');
        
        if (btnSalvar) {
            btnSalvar.addEventListener('click', this.salvarCliente);
        }
        
        if (btnFechar) {
            btnFechar.addEventListener('click', () => {
                this.elements.modalCliente.style.display = 'none';
            });
        }
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.modalCliente) {
                this.elements.modalCliente.style.display = 'none';
            }
        });
    }
    
    /**
     * Carrega os dados de clientes
     */
    carregarClientes() {
        // Simulação de carregamento de dados
        fetch('../data/mock-data/clientes.json')
            .then(response => response.json())
            .then(data => {
                this.clientes = data;
                this.renderizarTabela();
            })
            .catch(error => {
                console.error('Erro ao carregar clientes:', error);
                // Dados de exemplo caso falhe o carregamento
                this.clientes = [
                    {
                        id: 1,
                        nome: 'João Silva',
                        cpf: '123.456.789-00',
                        telefone: '(11) 98765-4321',
                        email: 'joao.silva@email.com',
                        veiculos: 2,
                        status: 'ativo'
                    },
                    {
                        id: 2,
                        nome: 'Maria Oliveira',
                        cpf: '987.654.321-00',
                        telefone: '(11) 91234-5678',
                        email: 'maria.oliveira@email.com',
                        veiculos: 1,
                        status: 'ativo'
                    }
                ];
                this.renderizarTabela();
            });
    }
    
    /**
     * Renderiza a tabela de clientes
     */
    renderizarTabela() {
        if (!this.elements.tabelaClientes) return;
        
        const tbody = this.elements.tabelaClientes.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const clientesFiltrados = this.filtrarClientes();
        
        if (clientesFiltrados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="empty-state">Nenhum cliente encontrado</td>`;
            tbody.appendChild(tr);
            return;
        }
        
        clientesFiltrados.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.email}</td>
                <td>${cliente.veiculos}</td>
                <td><span class="status-badge ${cliente.status}">${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${cliente.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" data-id="${cliente.id}"><i class="fas fa-trash"></i></button>
                    <button class="btn-icon btn-view" data-id="${cliente.id}"><i class="fas fa-eye"></i></button>
                </td>
            `;
            
            // Adicionar eventos aos botões
            const btnEdit = tr.querySelector('.btn-edit');
            const btnDelete = tr.querySelector('.btn-delete');
            const btnView = tr.querySelector('.btn-view');
            
            if (btnEdit) {
                btnEdit.addEventListener('click', () => this.editarCliente(cliente.id));
            }
            
            if (btnDelete) {
                btnDelete.addEventListener('click', () => this.excluirCliente(cliente.id));
            }
            
            if (btnView) {
                btnView.addEventListener('click', () => this.visualizarCliente(cliente.id));
            }
            
            tbody.appendChild(tr);
        });
    }
    
    /**
     * Filtra os clientes com base no filtro atual
     */
    filtrarClientes() {
        let clientesFiltrados = [...this.clientes];
        
        // Aplicar filtro de status
        if (this.filtroAtual === 'ativos') {
            clientesFiltrados = clientesFiltrados.filter(cliente => cliente.status === 'ativo');
        } else if (this.filtroAtual === 'inativos') {
            clientesFiltrados = clientesFiltrados.filter(cliente => cliente.status === 'inativo');
        }
        
        // Aplicar termo de busca
        if (this.termoBusca) {
            const termo = this.termoBusca.toLowerCase();
            clientesFiltrados = clientesFiltrados.filter(cliente => 
                cliente.nome.toLowerCase().includes(termo) || 
                cliente.cpf.includes(termo) || 
                cliente.telefone.includes(termo) || 
                cliente.email.toLowerCase().includes(termo)
            );
        }
        
        return clientesFiltrados;
    }
    
    /**
     * Atualiza o termo de busca e filtra os resultados
     */
    buscarClientes() {
        this.termoBusca = this.elements.searchInput.value;
        this.renderizarTabela();
    }
    
    /**
     * Abre o modal para criar/editar cliente
     * @param {Object} cliente - Dados do cliente para edição (opcional)
     */
    abrirModalCliente(cliente = null) {
        if (!this.elements.modalCliente) return;
        
        const titulo = this.elements.modalCliente.querySelector('.modal-title');
        const form = this.elements.modalCliente.querySelector('form');
        
        if (titulo) {
            titulo.textContent = cliente ? 'Editar Cliente' : 'Novo Cliente';
        }
        
        if (form) {
            form.reset();
            
            if (cliente) {
                // Preencher formulário com dados do cliente
                form.elements.id.value = cliente.id;
                form.elements.nome.value = cliente.nome;
                form.elements.cpf.value = cliente.cpf;
                form.elements.telefone.value = cliente.telefone;
                form.elements.email.value = cliente.email;
                form.elements.status.value = cliente.status;
            } else {
                form.elements.id.value = '';
            }
        }
        
        this.elements.modalCliente.style.display = 'block';
    }
    
    /**
     * Salva os dados do cliente (novo ou editado)
     */
    salvarCliente() {
        if (!this.elements.modalCliente) return;
        
        const form = this.elements.modalCliente.querySelector('form');
        if (!form) return;
        
        // Validar formulário
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const id = form.elements.id.value;
        const novoCliente = {
            id: id ? parseInt(id) : Date.now(),
            nome: form.elements.nome.value,
            cpf: form.elements.cpf.value,
            telefone: form.elements.telefone.value,
            email: form.elements.email.value,
            veiculos: id ? this.clientes.find(c => c.id === parseInt(id)).veiculos : 0,
            status: form.elements.status.value
        };
        
        if (id) {
            // Atualizar cliente existente
            const index = this.clientes.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                this.clientes[index] = novoCliente;
            }
        } else {
            // Adicionar novo cliente
            this.clientes.push(novoCliente);
        }
        
        // Fechar modal e atualizar tabela
        this.elements.modalCliente.style.display = 'none';
        this.renderizarTabela();
        
        // Exibir notificação
        alert(id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
    }
    
    /**
     * Abre o modal para edição de cliente
     * @param {number} id - ID do cliente
     */
    editarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            this.abrirModalCliente(cliente);
        }
    }
    
    /**
     * Exclui um cliente
     * @param {number} id - ID do cliente
     */
    excluirCliente(id) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            const index = this.clientes.findIndex(c => c.id === id);
            if (index !== -1) {
                this.clientes.splice(index, 1);
                this.renderizarTabela();
                alert('Cliente excluído com sucesso!');
            }
        }
    }
    
    /**
     * Visualiza detalhes do cliente
     * @param {number} id - ID do cliente
     */
    visualizarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            alert(`Detalhes do Cliente:\n\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nTelefone: ${cliente.telefone}\nE-mail: ${cliente.email}\nVeículos: ${cliente.veiculos}\nStatus: ${cliente.status}`);
            // Aqui poderia abrir um modal de visualização mais elaborado
        }
    }
}

// Inicializar o módulo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const clientesModule = new ClientesModule();
    clientesModule.init();
});

// Exportar o módulo para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClientesModule };
}