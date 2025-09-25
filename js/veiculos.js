/**
 * Gerenciador de Veículos
 * Sistema completo para cadastro, edição e listagem de veículos
 */

class VeiculosManager {
    constructor() {
        this.veiculos = this.carregarVeiculos();
        this.clientes = this.carregarClientes();
        this.veiculoEditando = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderizarVeiculos();
        this.atualizarEstatisticas();
    }

    bindEvents() {
        console.log('VeiculosManager: Iniciando bindEvents...');
        
        // Botão Novo Veículo
        const btnNovoVeiculo = document.getElementById('btn-novo-veiculo');
        console.log('VeiculosManager: Botão Novo Veículo encontrado:', btnNovoVeiculo);
        
        if (btnNovoVeiculo) {
            console.log('VeiculosManager: Adicionando event listener ao botão Novo Veículo');
            btnNovoVeiculo.addEventListener('click', (e) => {
                console.log('VeiculosManager: Botão Novo Veículo clicado!');
                e.preventDefault();
                this.abrirModal();
            });
        } else {
            console.error('VeiculosManager: Botão btn-novo-veiculo não encontrado no DOM!');
        }

        // Botão Salvar Veículo
        const btnSalvar = document.getElementById('salvarVeiculo');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => this.salvarVeiculo());
        } else {
            console.warn('VeiculosManager: Botão salvarVeiculo não encontrado no DOM');
        }

        // Filtros e busca
        const inputBusca = document.getElementById('busca-veiculo');
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => this.filtrarVeiculos(e.target.value));
        }

        const filtroMarca = document.getElementById('filtro-marca');
        if (filtroMarca) {
            filtroMarca.addEventListener('change', (e) => this.filtrarPorMarca(e.target.value));
        }

        const filtroStatus = document.getElementById('filtro-status');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', (e) => this.filtrarPorStatus(e.target.value));
        }

        // Reset do modal ao fechar
        const modal = document.getElementById('veiculoModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => this.resetModal());
        }
    }

    abrirModal(veiculo = null) {
        console.log('VeiculosManager: Método abrirModal chamado com veiculo:', veiculo);
        
        this.veiculoEditando = veiculo;
        
        const modalElement = document.getElementById('veiculoModal');
        console.log('VeiculosManager: Modal element encontrado:', modalElement);
        
        if (!modalElement) {
            console.error('VeiculosManager: Modal veiculoModal não encontrado no DOM!');
            return;
        }
        
        const modalLabel = document.getElementById('veiculoModalLabel');
        console.log('VeiculosManager: Modal label encontrado:', modalLabel);
        
        if (veiculo) {
            console.log('VeiculosManager: Preenchendo modal para edição');
            this.preencherModal(veiculo);
            if (modalLabel) {
                modalLabel.textContent = 'Editar Veículo';
            } else {
                console.warn('VeiculosManager: veiculoModalLabel não encontrado');
            }
        } else {
            console.log('VeiculosManager: Resetando modal para novo veículo');
            this.resetModal();
            if (modalLabel) {
                modalLabel.textContent = 'Novo Veículo';
            } else {
                console.warn('VeiculosManager: veiculoModalLabel não encontrado');
            }
        }
        
        console.log('VeiculosManager: Tentando mostrar modal usando CSS...');
        // Usar CSS puro - adicionar classe show
        modalElement.classList.add('show');
        console.log('VeiculosManager: Modal mostrado usando classe show');
    }

    preencherModal(veiculo) {
        document.getElementById('clienteVeiculo').value = veiculo.cliente_id || '';
        document.getElementById('marcaVeiculo').value = veiculo.marca || '';
        document.getElementById('modeloVeiculo').value = veiculo.modelo || '';
        document.getElementById('anoVeiculo').value = veiculo.ano || '';
        document.getElementById('placaVeiculo').value = veiculo.placa || '';
        document.getElementById('corVeiculo').value = veiculo.cor || '';
        document.getElementById('combustivelVeiculo').value = veiculo.combustivel || '';
        document.getElementById('cambioVeiculo').value = veiculo.cambio || '';
        document.getElementById('quilometragemVeiculo').value = veiculo.quilometragem || '';
        document.getElementById('chassiVeiculo').value = veiculo.chassi || '';
        document.getElementById('renavamVeiculo').value = veiculo.renavam || '';
        document.getElementById('categoriaVeiculo').value = veiculo.categoria || '';
        document.getElementById('statusVeiculo').value = veiculo.status || 'ativo';
        document.getElementById('observacoesVeiculo').value = veiculo.observacoes || '';

        // Trigger change para carregar modelos se necessário
        if (veiculo.marca) {
            carregarModelos();
        }
    }

    resetModal() {
        document.getElementById('veiculoForm').reset();
        this.veiculoEditando = null;
        
        // Limpar datalist de modelos
        const datalist = document.getElementById('modelosList');
        if (datalist) {
            datalist.innerHTML = '';
        }
    }

    salvarVeiculo() {
        const form = document.getElementById('veiculoForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Validar placa única
        const placa = document.getElementById('placaVeiculo').value;
        const placaExistente = this.veiculos.find(v => 
            v.placa.toLowerCase() === placa.toLowerCase() && 
            (!this.veiculoEditando || v.id !== this.veiculoEditando.id)
        );

        if (placaExistente) {
            this.mostrarNotificacao('Esta placa já está cadastrada para outro veículo!', 'error');
            document.getElementById('placaVeiculo').focus();
            return;
        }

        const formData = new FormData(form);
        const veiculo = {
            id: this.veiculoEditando ? this.veiculoEditando.id : Date.now(),
            cliente_id: parseInt(formData.get('cliente_id')),
            marca: formData.get('marca'),
            modelo: formData.get('modelo'),
            ano: parseInt(formData.get('ano')),
            placa: formData.get('placa').toUpperCase(),
            cor: formData.get('cor'),
            combustivel: formData.get('combustivel'),
            cambio: formData.get('cambio'),
            quilometragem: formData.get('quilometragem') ? parseInt(formData.get('quilometragem').replace(/\D/g, '')) : null,
            chassi: formData.get('chassi').toUpperCase(),
            renavam: formData.get('renavam'),
            categoria: formData.get('categoria'),
            status: formData.get('status'),
            observacoes: formData.get('observacoes'),
            data_cadastro: this.veiculoEditando ? this.veiculoEditando.data_cadastro : new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        };

        if (this.veiculoEditando) {
            const index = this.veiculos.findIndex(v => v.id === this.veiculoEditando.id);
            this.veiculos[index] = veiculo;
            this.mostrarNotificacao('Veículo atualizado com sucesso!', 'success');
        } else {
            this.veiculos.push(veiculo);
            this.mostrarNotificacao('Veículo cadastrado com sucesso!', 'success');
        }

        this.salvarVeiculos();
        this.renderizarVeiculos();
        this.atualizarEstatisticas();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('veiculoModal'));
        modal.hide();
    }

    excluirVeiculo(id) {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            this.veiculos = this.veiculos.filter(v => v.id !== id);
            this.salvarVeiculos();
            this.renderizarVeiculos();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Veículo excluído com sucesso!', 'success');
        }
    }

    renderizarVeiculos() {
        const tbody = document.querySelector('#tabela-veiculos tbody');
        if (!tbody) return;

        if (this.veiculos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-car fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Nenhum veículo cadastrado</p>
                        <button class="btn btn-primary" onclick="veiculosManager.abrirModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeiro Veículo
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.veiculos.map(veiculo => {
            const cliente = this.clientes.find(c => c.id === veiculo.cliente_id);
            const nomeCliente = cliente ? cliente.nome : 'Cliente não encontrado';
            
            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm me-2">
                                <div class="avatar-title bg-info rounded-circle">
                                    <i class="fas fa-car"></i>
                                </div>
                            </div>
                            <div>
                                <h6 class="mb-0">${veiculo.marca} ${veiculo.modelo}</h6>
                                <small class="text-muted">${veiculo.ano}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-dark">${veiculo.placa}</span>
                    </td>
                    <td>
                        <div>
                            <i class="fas fa-user text-muted me-1"></i>
                            ${nomeCliente}
                        </div>
                        ${cliente && cliente.telefone ? `
                            <div>
                                <i class="fas fa-phone text-muted me-1"></i>
                                <small>${cliente.telefone}</small>
                            </div>
                        ` : ''}
                    </td>
                    <td>
                        ${veiculo.cor || '-'}
                        ${veiculo.combustivel ? `<br><small class="text-muted">${veiculo.combustivel}</small>` : ''}
                    </td>
                    <td>
                        ${veiculo.quilometragem ? `${parseInt(veiculo.quilometragem).toLocaleString('pt-BR')} km` : '-'}
                    </td>
                    <td>
                        <span class="badge bg-${this.getStatusColor(veiculo.status)}">
                            ${this.getStatusLabel(veiculo.status)}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary" onclick="veiculosManager.abrirModal(${JSON.stringify(veiculo).replace(/"/g, '&quot;')})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="veiculosManager.visualizarVeiculo(${veiculo.id})" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="veiculosManager.criarOrdemServico(${veiculo.id})" title="Nova Ordem de Serviço">
                                <i class="fas fa-wrench"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="veiculosManager.excluirVeiculo(${veiculo.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    visualizarVeiculo(id) {
        const veiculo = this.veiculos.find(v => v.id === id);
        if (!veiculo) return;

        const cliente = this.clientes.find(c => c.id === veiculo.cliente_id);

        const detalhes = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Informações do Veículo</h6>
                    <p><strong>Marca/Modelo:</strong> ${veiculo.marca} ${veiculo.modelo}</p>
                    <p><strong>Ano:</strong> ${veiculo.ano}</p>
                    <p><strong>Placa:</strong> ${veiculo.placa}</p>
                    <p><strong>Cor:</strong> ${veiculo.cor || '-'}</p>
                    <p><strong>Status:</strong> ${this.getStatusLabel(veiculo.status)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Proprietário</h6>
                    <p><strong>Nome:</strong> ${cliente ? cliente.nome : 'Cliente não encontrado'}</p>
                    ${cliente && cliente.telefone ? `<p><strong>Telefone:</strong> ${cliente.telefone}</p>` : ''}
                    ${cliente && cliente.email ? `<p><strong>E-mail:</strong> ${cliente.email}</p>` : ''}
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h6>Detalhes Técnicos</h6>
                    <p><strong>Combustível:</strong> ${veiculo.combustivel || '-'}</p>
                    <p><strong>Câmbio:</strong> ${veiculo.cambio || '-'}</p>
                    <p><strong>Quilometragem:</strong> ${veiculo.quilometragem ? `${parseInt(veiculo.quilometragem).toLocaleString('pt-BR')} km` : '-'}</p>
                    <p><strong>Categoria:</strong> ${veiculo.categoria || '-'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Documentação</h6>
                    <p><strong>Chassi:</strong> ${veiculo.chassi || '-'}</p>
                    <p><strong>RENAVAM:</strong> ${veiculo.renavam || '-'}</p>
                </div>
            </div>
            ${veiculo.observacoes ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observações</h6>
                        <p>${veiculo.observacoes}</p>
                    </div>
                </div>
            ` : ''}
        `;

        // Criar modal de visualização
        const modalHtml = `
            <div class="modal fade" id="visualizarVeiculoModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Veículo</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${detalhes}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-success" onclick="veiculosManager.criarOrdemServico(${veiculo.id}); bootstrap.Modal.getInstance(document.getElementById('visualizarVeiculoModal')).hide();">
                                <i class="fas fa-wrench"></i> Nova Ordem de Serviço
                            </button>
                            <button type="button" class="btn btn-primary" onclick="veiculosManager.abrirModal(${JSON.stringify(veiculo).replace(/"/g, '&quot;')}); bootstrap.Modal.getInstance(document.getElementById('visualizarVeiculoModal')).hide();">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const modalExistente = document.getElementById('visualizarVeiculoModal');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Adicionar novo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('visualizarVeiculoModal'));
        modal.show();

        // Remover modal após fechar
        document.getElementById('visualizarVeiculoModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    criarOrdemServico(veiculoId) {
        const veiculo = this.veiculos.find(v => v.id === veiculoId);
        if (!veiculo) return;

        // Redirecionar para página de serviços com o veículo pré-selecionado
        localStorage.setItem('veiculo_preselected', JSON.stringify(veiculo));
        window.location.href = '../pages/servicos.html';
    }

    filtrarVeiculos(termo) {
        const veiculosFiltrados = this.veiculos.filter(veiculo => {
            const cliente = this.clientes.find(c => c.id === veiculo.cliente_id);
            const nomeCliente = cliente ? cliente.nome.toLowerCase() : '';
            
            return veiculo.marca.toLowerCase().includes(termo.toLowerCase()) ||
                   veiculo.modelo.toLowerCase().includes(termo.toLowerCase()) ||
                   veiculo.placa.toLowerCase().includes(termo.toLowerCase()) ||
                   nomeCliente.includes(termo.toLowerCase()) ||
                   veiculo.ano.toString().includes(termo);
        });
        this.renderizarVeiculosFiltrados(veiculosFiltrados);
    }

    filtrarPorMarca(marca) {
        if (!marca) {
            this.renderizarVeiculos();
            return;
        }
        const veiculosFiltrados = this.veiculos.filter(veiculo => veiculo.marca === marca);
        this.renderizarVeiculosFiltrados(veiculosFiltrados);
    }

    filtrarPorStatus(status) {
        if (!status) {
            this.renderizarVeiculos();
            return;
        }
        const veiculosFiltrados = this.veiculos.filter(veiculo => veiculo.status === status);
        this.renderizarVeiculosFiltrados(veiculosFiltrados);
    }

    renderizarVeiculosFiltrados(veiculos) {
        const tbody = document.querySelector('#tabela-veiculos tbody');
        if (!tbody) return;

        if (veiculos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-search fa-2x text-muted mb-2"></i>
                        <p class="text-muted">Nenhum veículo encontrado com os filtros aplicados</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Usar a mesma lógica de renderização, mas com os veículos filtrados
        const veiculosOriginais = this.veiculos;
        this.veiculos = veiculos;
        this.renderizarVeiculos();
        this.veiculos = veiculosOriginais;
    }

    atualizarEstatisticas() {
        const totalVeiculos = document.getElementById('total-veiculos');
        const veiculosAtivos = document.getElementById('veiculos-ativos');
        const veiculosInativos = document.getElementById('veiculos-inativos');
        const marcasUnicas = document.getElementById('marcas-unicas');

        if (totalVeiculos) totalVeiculos.textContent = this.veiculos.length;
        if (veiculosAtivos) veiculosAtivos.textContent = this.veiculos.filter(v => v.status === 'ativo').length;
        if (veiculosInativos) veiculosInativos.textContent = this.veiculos.filter(v => v.status === 'inativo').length;
        if (marcasUnicas) {
            const marcas = [...new Set(this.veiculos.map(v => v.marca))];
            marcasUnicas.textContent = marcas.length;
        }

        // Atualizar filtro de marcas
        this.atualizarFiltroMarcas();
    }

    atualizarFiltroMarcas() {
        const filtroMarca = document.getElementById('filtro-marca');
        if (!filtroMarca) return;

        const marcas = [...new Set(this.veiculos.map(v => v.marca))].sort();
        const opcaoAtual = filtroMarca.value;
        
        filtroMarca.innerHTML = '<option value="">Todas as marcas</option>';
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            if (marca === opcaoAtual) option.selected = true;
            filtroMarca.appendChild(option);
        });
    }

    getStatusColor(status) {
        const cores = {
            'ativo': 'success',
            'inativo': 'secondary',
            'vendido': 'warning'
        };
        return cores[status] || 'secondary';
    }

    getStatusLabel(status) {
        const labels = {
            'ativo': 'Ativo',
            'inativo': 'Inativo',
            'vendido': 'Vendido'
        };
        return labels[status] || status;
    }

    carregarVeiculos() {
        const dados = localStorage.getItem('oficina_veiculos');
        return dados ? JSON.parse(dados) : [];
    }

    carregarClientes() {
        const dados = localStorage.getItem('oficina_clientes');
        return dados ? JSON.parse(dados) : [];
    }

    salvarVeiculos() {
        localStorage.setItem('oficina_veiculos', JSON.stringify(this.veiculos));
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar notificação toast
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${tipo === 'success' ? 'success' : tipo === 'error' ? 'danger' : 'info'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                        ${mensagem}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        // Container para toasts
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remover toast após ser ocultado
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Método para exportar dados
    exportarVeiculos() {
        const dados = this.veiculos.map(veiculo => {
            const cliente = this.clientes.find(c => c.id === veiculo.cliente_id);
            return {
                Marca: veiculo.marca,
                Modelo: veiculo.modelo,
                Ano: veiculo.ano,
                Placa: veiculo.placa,
                Proprietário: cliente ? cliente.nome : 'N/A',
                Cor: veiculo.cor,
                Combustível: veiculo.combustivel,
                Quilometragem: veiculo.quilometragem,
                Status: this.getStatusLabel(veiculo.status)
            };
        });

        const csv = this.converterParaCSV(dados);
        this.downloadCSV(csv, 'veiculos.csv');
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
let veiculosManager;
document.addEventListener('DOMContentLoaded', function() {
    veiculosManager = new VeiculosManager();
});