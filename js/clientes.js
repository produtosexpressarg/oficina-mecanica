/**
 * Gerenciador de Clientes
 * Sistema completo para cadastro, edição e listagem de clientes
 */

class ClientesManager {
    constructor() {
        this.clientes = this.carregarClientes();
        this.clienteEditando = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderizarClientes();
        this.atualizarEstatisticas();
    }

    bindEvents() {
        console.log('ClientesManager: Iniciando bindEvents...');
        
        // Botão Novo Cliente
        const btnNovoCliente = document.getElementById('btn-novo-cliente');
        console.log('ClientesManager: Botão Novo Cliente encontrado:', btnNovoCliente);
        
        if (btnNovoCliente) {
            console.log('ClientesManager: Adicionando event listener ao botão Novo Cliente');
            btnNovoCliente.removeEventListener('click', this.handleNovoCliente);
            btnNovoCliente.addEventListener('click', this.handleNovoCliente);
        } else {
            console.error('ClientesManager: Botão btn-novo-cliente não encontrado no DOM!');
        }

        // Botão Salvar Cliente
        const btnSalvar = document.getElementById('salvarCliente');
        if (btnSalvar) {
            btnSalvar.removeEventListener('click', this.handleSalvarCliente);
            btnSalvar.addEventListener('click', this.handleSalvarCliente);
            console.log('ClientesManager: Event listener adicionado ao botão Salvar Cliente');
        } else {
            console.warn('ClientesManager: Botão salvarCliente não encontrado no DOM');
        }

        // Botões de fechar modal
        const btnFechar = document.querySelector('.modal-close');
        if (btnFechar) {
            btnFechar.addEventListener('click', () => this.fecharModal());
        }

        const btnCancelar = document.querySelector('.btn-outline');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.fecharModal());
        }

        // Filtros e busca
        const inputBusca = document.getElementById('busca-cliente');
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => this.filtrarClientes(e.target.value));
        }
    }

    handleNovoCliente = () => {
        console.log('ClientesManager: Botão Novo Cliente clicado!');
        this.abrirModal();
    }

    handleSalvarCliente = (e) => {
        e.preventDefault();
        console.log('ClientesManager: Botão Salvar Cliente clicado!');
        this.salvarCliente();

        const filtroStatus = document.getElementById('filtro-status');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', (e) => this.filtrarPorStatus(e.target.value));
        }

        const filtroTipo = document.getElementById('filtro-tipo');
        if (filtroTipo) {
            filtroTipo.addEventListener('change', (e) => this.filtrarPorTipo(e.target.value));
        }

        // Reset do modal ao fechar
        const modal = document.getElementById('clienteModal');
        if (modal) {
            // Não usar Bootstrap - usar eventos padrão
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal();
                }
            });
        }
    }

    abrirModal(cliente = null) {
        console.log('ClientesManager: abrirModal chamado com cliente:', cliente);
        
        this.clienteEditando = cliente;
        const modal = document.getElementById('clienteModal');
        
        console.log('ClientesManager: Modal encontrado:', modal);
        
        if (!modal) {
            console.error('ClientesManager: Modal clienteModal não encontrado no DOM!');
            return;
        }

        if (cliente) {
            console.log('ClientesManager: Preenchendo modal para edição');
            this.preencherModal(cliente);
            const modalLabel = document.getElementById('clienteModalLabel');
            if (modalLabel) {
                modalLabel.textContent = 'Editar Cliente';
            }
        } else {
            console.log('ClientesManager: Resetando modal para novo cliente');
            this.resetModal();
            const modalLabel = document.getElementById('clienteModalLabel');
            if (modalLabel) {
                modalLabel.textContent = 'Novo Cliente';
            }
        }
        
        // Mostrar modal usando CSS puro - adicionar classe show
        console.log('ClientesManager: Exibindo modal...');
        modal.classList.add('show');
        console.log('ClientesManager: Modal exibido com sucesso!');
    }

    fecharModal() {
        const modal = document.getElementById('clienteModal');
        if (modal) {
            modal.classList.remove('show');
        }
        this.clienteEditando = null;
        this.resetModal();
    }

    preencherModal(cliente) {
        document.getElementById('nomeCliente').value = cliente.nome || '';
        document.getElementById('tipoCliente').value = cliente.tipo || 'pessoa_fisica';
        document.getElementById('cpfCliente').value = cliente.cpf || '';
        document.getElementById('cnpjCliente').value = cliente.cnpj || '';
        document.getElementById('rgCliente').value = cliente.rg || '';
        document.getElementById('ieCliente').value = cliente.inscricao_estadual || '';
        document.getElementById('telefoneCliente').value = cliente.telefone || '';
        document.getElementById('emailCliente').value = cliente.email || '';
        document.getElementById('cepCliente').value = cliente.cep || '';
        document.getElementById('enderecoCliente').value = cliente.endereco || '';
        document.getElementById('numeroCliente').value = cliente.numero || '';
        document.getElementById('complementoCliente').value = cliente.complemento || '';
        document.getElementById('bairroCliente').value = cliente.bairro || '';
        document.getElementById('cidadeCliente').value = cliente.cidade || '';
        document.getElementById('estadoCliente').value = cliente.estado || '';
        document.getElementById('statusCliente').value = cliente.status || 'ativo';
        document.getElementById('observacoesCliente').value = cliente.observacoes || '';

        // Trigger change para mostrar campos corretos
        toggleDocumento();
    }

    resetModal() {
        document.getElementById('clientForm').reset();
        this.clienteEditando = null;
    }

    salvarCliente() {
        console.log('ClientesManager: Iniciando salvarCliente...');
        const form = document.getElementById('clientForm');
        if (!form) {
            console.error('ClientesManager: Formulário clienteForm não encontrado!');
            return;
        }

        if (!form.checkValidity()) {
            console.log('ClientesManager: Formulário inválido, mostrando validação...');
            form.reportValidity();
            return;
        }

        console.log('ClientesManager: Formulário válido, coletando dados...');
        const formData = new FormData(form);
        const cliente = {
            id: this.clienteEditando ? this.clienteEditando.id : Date.now(),
            nome: formData.get('nome'),
            tipo: formData.get('tipo'),
            cpf: formData.get('cpf'),
            cnpj: formData.get('cnpj'),
            rg: formData.get('rg'),
            inscricao_estadual: formData.get('inscricao_estadual'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            cep: formData.get('cep'),
            endereco: formData.get('endereco'),
            numero: formData.get('numero'),
            complemento: formData.get('complemento'),
            bairro: formData.get('bairro'),
            cidade: formData.get('cidade'),
            estado: formData.get('estado'),
            status: formData.get('status') || 'ativo',
            observacoes: formData.get('observacoes'),
            data_cadastro: this.clienteEditando ? this.clienteEditando.data_cadastro : new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        };

        console.log('ClientesManager: Dados do cliente coletados:', cliente);

        if (this.clienteEditando) {
            const index = this.clientes.findIndex(c => c.id === this.clienteEditando.id);
            this.clientes[index] = cliente;
            this.mostrarNotificacao('Cliente atualizado com sucesso!', 'success');
            console.log('ClientesManager: Cliente atualizado');
        } else {
            this.clientes.push(cliente);
            this.mostrarNotificacao('Cliente cadastrado com sucesso!', 'success');
            console.log('ClientesManager: Novo cliente adicionado');
        }

        this.salvarClientes();
        this.renderizarClientes();
        this.atualizarEstatisticas();
        
        // Fechar modal
        this.fecharModal();
        console.log('ClientesManager: Cliente salvo com sucesso!');
    }

    excluirCliente(id) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            this.clientes = this.clientes.filter(c => c.id !== id);
            this.salvarClientes();
            this.renderizarClientes();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Cliente excluído com sucesso!', 'success');
        }
    }

    renderizarClientes() {
        const tbody = document.querySelector('#tabela-clientes tbody');
        if (!tbody) return;

        if (this.clientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Nenhum cliente cadastrado</p>
                        <button class="btn btn-primary" onclick="clientesManager.abrirModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeiro Cliente
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.clientes.map(cliente => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm me-2">
                            <div class="avatar-title bg-primary rounded-circle">
                                ${cliente.nome.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h6 class="mb-0">${cliente.nome}</h6>
                            <small class="text-muted">${cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <i class="fas fa-phone text-muted me-1"></i>
                        ${cliente.telefone || '-'}
                    </div>
                    ${cliente.email ? `
                        <div>
                            <i class="fas fa-envelope text-muted me-1"></i>
                            ${cliente.email}
                        </div>
                    ` : ''}
                </td>
                <td>${cliente.tipo === 'pessoa_fisica' ? (cliente.cpf || '-') : (cliente.cnpj || '-')}</td>
                <td>
                    ${cliente.cidade ? `${cliente.cidade}` : ''}
                    ${cliente.estado ? ` - ${cliente.estado}` : ''}
                    ${!cliente.cidade && !cliente.estado ? '-' : ''}
                </td>
                <td>
                    <span class="badge bg-${cliente.status === 'ativo' ? 'success' : 'secondary'}">
                        ${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="clientesManager.abrirModal(${JSON.stringify(cliente).replace(/"/g, '&quot;')})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="clientesManager.visualizarCliente(${cliente.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="clientesManager.excluirCliente(${cliente.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    visualizarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (!cliente) return;

        const detalhes = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Informações Básicas</h6>
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Tipo:</strong> ${cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                    <p><strong>Documento:</strong> ${cliente.tipo === 'pessoa_fisica' ? (cliente.cpf || '-') : (cliente.cnpj || '-')}</p>
                    <p><strong>Status:</strong> ${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Contato</h6>
                    <p><strong>Telefone:</strong> ${cliente.telefone || '-'}</p>
                    <p><strong>E-mail:</strong> ${cliente.email || '-'}</p>
                </div>
            </div>
            ${cliente.endereco ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Endereço</h6>
                        <p>${cliente.endereco}${cliente.numero ? `, ${cliente.numero}` : ''}</p>
                        <p>${cliente.bairro}${cliente.cidade ? ` - ${cliente.cidade}` : ''}${cliente.estado ? `/${cliente.estado}` : ''}</p>
                        ${cliente.cep ? `<p>CEP: ${cliente.cep}</p>` : ''}
                    </div>
                </div>
            ` : ''}
            ${cliente.observacoes ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observações</h6>
                        <p>${cliente.observacoes}</p>
                    </div>
                </div>
            ` : ''}
        `;

        // Criar modal de visualização
        const modalHtml = `
            <div class="modal fade" id="visualizarClienteModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Cliente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${detalhes}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary" onclick="clientesManager.abrirModal(${JSON.stringify(cliente).replace(/"/g, '&quot;')}); clientesManager.fecharModalVisualizacao();">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const modalExistente = document.getElementById('visualizarClienteModal');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Adicionar novo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        // Mostrar modal
        document.getElementById('visualizarClienteModal').style.display = 'flex';

        // Remover modal após fechar
        document.getElementById('visualizarClienteModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    fecharModalVisualizacao() {
        const modal = document.getElementById('visualizarClienteModal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        }
    }

    filtrarClientes(termo) {
        const clientesFiltrados = this.clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(termo.toLowerCase()) ||
            (cliente.cpf && cliente.cpf.includes(termo)) ||
            (cliente.cnpj && cliente.cnpj.includes(termo)) ||
            (cliente.telefone && cliente.telefone.includes(termo)) ||
            (cliente.email && cliente.email.toLowerCase().includes(termo.toLowerCase()))
        );
        this.renderizarClientesFiltrados(clientesFiltrados);
    }

    filtrarPorStatus(status) {
        if (!status) {
            this.renderizarClientes();
            return;
        }
        const clientesFiltrados = this.clientes.filter(cliente => cliente.status === status);
        this.renderizarClientesFiltrados(clientesFiltrados);
    }

    filtrarPorTipo(tipo) {
        if (!tipo) {
            this.renderizarClientes();
            return;
        }
        const clientesFiltrados = this.clientes.filter(cliente => cliente.tipo === tipo);
        this.renderizarClientesFiltrados(clientesFiltrados);
    }

    renderizarClientesFiltrados(clientes) {
        const tbody = document.querySelector('#tabela-clientes tbody');
        if (!tbody) return;

        if (clientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="fas fa-search fa-2x text-muted mb-2"></i>
                        <p class="text-muted">Nenhum cliente encontrado com os filtros aplicados</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Usar a mesma lógica de renderização, mas com os clientes filtrados
        const clientesOriginais = this.clientes;
        this.clientes = clientes;
        this.renderizarClientes();
        this.clientes = clientesOriginais;
    }

    atualizarEstatisticas() {
        const totalClientes = document.getElementById('total-clientes');
        const clientesAtivos = document.getElementById('clientes-ativos');
        const clientesInativos = document.getElementById('clientes-inativos');
        const pessoasFisicas = document.getElementById('pessoas-fisicas');

        if (totalClientes) totalClientes.textContent = this.clientes.length;
        if (clientesAtivos) clientesAtivos.textContent = this.clientes.filter(c => c.status === 'ativo').length;
        if (clientesInativos) clientesInativos.textContent = this.clientes.filter(c => c.status === 'inativo').length;
        if (pessoasFisicas) pessoasFisicas.textContent = this.clientes.filter(c => c.tipo === 'pessoa_fisica').length;
    }

    carregarClientes() {
        const dados = localStorage.getItem('oficina_clientes');
        return dados ? JSON.parse(dados) : [];
    }

    salvarClientes() {
        localStorage.setItem('oficina_clientes', JSON.stringify(this.clientes));
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar toast
        const toastElement = document.createElement('div');
        toastElement.className = `toast toast-${tipo}`;
        toastElement.innerHTML = `
            <div class="toast-body">
                ${mensagem}
            </div>
        `;
        
        // Adicionar estilos inline para o toast
        toastElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
            border: 1px solid ${tipo === 'success' ? '#c3e6cb' : tipo === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 0.375rem;
            padding: 0.75rem;
            min-width: 250px;
            z-index: 9999;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(toastElement);
        
        // Mostrar toast com animação
        setTimeout(() => {
            toastElement.style.opacity = '1';
            toastElement.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toastElement.style.opacity = '0';
            toastElement.style.transform = 'translateX(100%)';
            setTimeout(() => toastElement.remove(), 300);
        }, 3000);
    }

    // Método para exportar dados
    exportarClientes() {
        const dados = this.clientes.map(cliente => ({
            Nome: cliente.nome,
            Tipo: cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
            Documento: cliente.tipo === 'pessoa_fisica' ? cliente.cpf : cliente.cnpj,
            Telefone: cliente.telefone,
            Email: cliente.email,
            Cidade: cliente.cidade,
            Estado: cliente.estado,
            Status: cliente.status
        }));

        const csv = this.converterParaCSV(dados);
        this.downloadCSV(csv, 'clientes.csv');
    }

    converterParaCSV(dados) {
        if (dados.length === 0) return '';
        
        const headers = Object.keys(dados[0]);
        const csvContent = [
            headers.join(','),
            ...dados.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Inicializar quando o DOM estiver carregado
let clientesManager;
document.addEventListener('DOMContentLoaded', function() {
    clientesManager = new ClientesManager();
});