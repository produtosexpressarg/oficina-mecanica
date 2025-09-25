/**
 * Gerenciador de Vendas e Pagamentos
 * Sistema completo para vendas, pagamentos e relatórios
 */

class VendasManager {
    constructor() {
        this.vendas = this.carregarVendas();
        this.clientes = this.carregarClientes();
        this.veiculos = this.carregarVeiculos();
        this.servicos = this.carregarServicos();
        this.produtos = this.carregarProdutos();
        this.vendaEditando = null;
        this.itensVenda = [];
        this.abaAtiva = 'vendas';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderizarVendas();
        this.atualizarEstatisticas();
        this.carregarFiltroClientes();
        this.mostrarAba('vendas');
    }

    bindEvents() {
        // Botões principais
        const btnNovaVenda = document.querySelector('[onclick="abrirModalVenda()"]');
        if (btnNovaVenda) {
            btnNovaVenda.onclick = () => this.abrirModalVenda();
        }

        const btnRegistrarPagamento = document.querySelector('[onclick="abrirModalPagamento()"]');
        if (btnRegistrarPagamento) {
            btnRegistrarPagamento.onclick = () => this.abrirModalPagamento();
        }

        const btnGerarNotaFiscal = document.querySelector('[onclick="gerarNotaFiscal()"]');
        if (btnGerarNotaFiscal) {
            btnGerarNotaFiscal.onclick = () => this.gerarNotaFiscal();
        }

        const btnExportar = document.querySelector('[onclick="exportarVendas()"]');
        if (btnExportar) {
            btnExportar.onclick = () => this.exportarVendas();
        }

        const btnRelatorio = document.querySelector('[onclick="gerarRelatorio()"]');
        if (btnRelatorio) {
            btnRelatorio.onclick = () => this.gerarRelatorio();
        }

        // Filtros
        const inputBusca = document.getElementById('search-venda');
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => this.filtrarVendas(e.target.value));
        }

        const filtroCliente = document.getElementById('filter-cliente');
        if (filtroCliente) {
            filtroCliente.addEventListener('change', (e) => this.filtrarPorCliente(e.target.value));
        }

        const filtroStatus = document.getElementById('filter-status');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', (e) => this.filtrarPorStatus(e.target.value));
        }

        const dataInicio = document.getElementById('data-inicio');
        const dataFim = document.getElementById('data-fim');
        if (dataInicio && dataFim) {
            dataInicio.addEventListener('change', () => this.filtrarPorPeriodo());
            dataFim.addEventListener('change', () => this.filtrarPorPeriodo());
        }

        // Botão limpar filtros
        const btnLimparFiltros = document.querySelector('[onclick="limparFiltros()"]');
        if (btnLimparFiltros) {
            btnLimparFiltros.onclick = () => this.limparFiltros();
        }

        // Abas
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const aba = e.target.closest('.tab-button').textContent.toLowerCase().includes('vendas') ? 'vendas' :
                           e.target.closest('.tab-button').textContent.toLowerCase().includes('pagamentos') ? 'pagamentos' : 'relatorios';
                this.mostrarAba(aba);
            });
        });

        // Sidebar toggle
        window.toggleSidebar = () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
            }
        };

        // Logout
        window.logout = () => {
            if (confirm('Tem certeza que deseja sair?')) {
                window.location.href = '../login.html';
            }
        };
    }

    abrirModalVenda(id = null) {
        this.vendaEditando = id ? this.vendas.find(v => v.id === id) : null;
        this.itensVenda = this.vendaEditando ? [...this.vendaEditando.itens] : [];
        
        // Carregar modal dinamicamente se não existir
        this.carregarModalVenda().then(() => {
            const modalElement = document.getElementById('vendaModal');
            
            if (this.vendaEditando) {
                this.preencherModalVenda(this.vendaEditando);
                document.getElementById('vendaModalLabel').textContent = 'Editar Venda';
            } else {
                this.resetModalVenda();
                document.getElementById('vendaModalLabel').textContent = 'Nova Venda';
            }
            
            // Mostrar modal com CSS puro
            modalElement.classList.add('show');
        });
    }

    async carregarModalVenda() {
        // Verificar se o modal já existe
        if (document.getElementById('vendaModal')) {
            return;
        }

        // Criar modal de venda
        const modalHtml = `
            <div class="modal fade" id="vendaModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="vendaModalLabel">Nova Venda</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="vendaForm">
                                <!-- Informações do Cliente -->
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <h6><i class="fas fa-user text-primary"></i> Informações do Cliente</h6>
                                        <hr>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="clienteVenda" class="form-label">Cliente *</label>
                                        <select id="clienteVenda" name="cliente_id" class="form-select" required>
                                            <option value="">Selecione um cliente</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="veiculoVenda" class="form-label">Veículo</label>
                                        <select id="veiculoVenda" name="veiculo_id" class="form-select">
                                            <option value="">Selecione um veículo</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Adicionar Itens -->
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <h6><i class="fas fa-shopping-cart text-primary"></i> Adicionar Itens</h6>
                                        <hr>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="tipoItem" class="form-label">Tipo</label>
                                        <select id="tipoItem" class="form-select">
                                            <option value="">Selecione</option>
                                            <option value="servico">Serviço</option>
                                            <option value="produto">Produto</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="itemDisponivel" class="form-label">Item</label>
                                        <select id="itemDisponivel" class="form-select">
                                            <option value="">Selecione um item</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label for="quantidadeItem" class="form-label">Qtd</label>
                                        <input type="number" id="quantidadeItem" class="form-control" min="1" value="1">
                                    </div>
                                    <div class="col-md-2">
                                        <label for="valorItem" class="form-label">Valor</label>
                                        <input type="text" id="valorItem" class="form-control" placeholder="R$ 0,00">
                                    </div>
                                    <div class="col-md-1 d-flex align-items-end">
                                        <button type="button" class="btn btn-success" onclick="vendasManager.adicionarItem()">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Lista de Itens -->
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <h6>Itens da Venda</h6>
                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Tipo</th>
                                                        <th>Qtd</th>
                                                        <th>Valor Unit.</th>
                                                        <th>Total</th>
                                                        <th>Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="itensVendaBody">
                                                    <tr class="text-center">
                                                        <td colspan="6" class="text-muted">Nenhum item adicionado</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <!-- Totais e Pagamento -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6><i class="fas fa-calculator text-primary"></i> Totais</h6>
                                        <hr>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <span id="subtotalVenda">R$ 0,00</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <label for="descontoVenda">Desconto (%):</label>
                                            <input type="number" id="descontoVenda" class="form-control w-25" min="0" max="100" step="0.01" value="0">
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Valor Desconto:</span>
                                            <span id="valorDescontoVenda">R$ 0,00</span>
                                        </div>
                                        <div class="d-flex justify-content-between fw-bold">
                                            <span>Total Final:</span>
                                            <span id="totalVenda">R$ 0,00</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6><i class="fas fa-credit-card text-primary"></i> Pagamento</h6>
                                        <hr>
                                        <div class="mb-3">
                                            <label for="formaPagamento" class="form-label">Forma de Pagamento *</label>
                                            <select id="formaPagamento" name="forma_pagamento" class="form-select" required>
                                                <option value="">Selecione</option>
                                                <option value="dinheiro">Dinheiro</option>
                                                <option value="cartao_debito">Cartão de Débito</option>
                                                <option value="cartao_credito">Cartão de Crédito</option>
                                                <option value="pix">PIX</option>
                                                <option value="transferencia">Transferência</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="prazo">A Prazo</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="statusPagamento" class="form-label">Status *</label>
                                            <select id="statusPagamento" name="status_pagamento" class="form-select" required>
                                                <option value="pendente">Pendente</option>
                                                <option value="pago">Pago</option>
                                                <option value="parcial">Parcial</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="observacoesVenda" class="form-label">Observações</label>
                                            <textarea id="observacoesVenda" name="observacoes" class="form-control" rows="3"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="vendasManager.salvarVenda()">
                                <i class="fas fa-save"></i> Salvar Venda
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind eventos do modal
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Cliente change - carregar veículos
        const clienteSelect = document.getElementById('clienteVenda');
        if (clienteSelect) {
            clienteSelect.addEventListener('change', () => this.carregarVeiculosCliente());
        }

        // Tipo item change - carregar itens disponíveis
        const tipoItem = document.getElementById('tipoItem');
        if (tipoItem) {
            tipoItem.addEventListener('change', () => this.carregarItensDisponiveis());
        }

        // Item change - preencher valor
        const itemDisponivel = document.getElementById('itemDisponivel');
        if (itemDisponivel) {
            itemDisponivel.addEventListener('change', () => this.preencherValorItem());
        }

        // Desconto change - recalcular totais
        const desconto = document.getElementById('descontoVenda');
        if (desconto) {
            desconto.addEventListener('input', () => this.calcularTotais());
        }

        // Carregar dados iniciais
        this.carregarClientesModal();
    }

    carregarClientesModal() {
        const select = document.getElementById('clienteVenda');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um cliente</option>';
        this.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    }

    carregarVeiculosCliente() {
        const clienteId = parseInt(document.getElementById('clienteVenda').value);
        const select = document.getElementById('veiculoVenda');
        
        select.innerHTML = '<option value="">Selecione um veículo</option>';
        
        if (clienteId) {
            const veiculosCliente = this.veiculos.filter(v => v.cliente_id === clienteId);
            veiculosCliente.forEach(veiculo => {
                const option = document.createElement('option');
                option.value = veiculo.id;
                option.textContent = `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`;
                select.appendChild(option);
            });
        }
    }

    carregarItensDisponiveis() {
        const tipo = document.getElementById('tipoItem').value;
        const select = document.getElementById('itemDisponivel');
        
        select.innerHTML = '<option value="">Selecione um item</option>';
        
        if (tipo === 'servico') {
            this.servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = servico.nome;
                option.dataset.valor = servico.valor;
                option.dataset.tipo = 'servico';
                select.appendChild(option);
            });
        } else if (tipo === 'produto') {
            this.produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = produto.nome;
                option.dataset.valor = produto.preco;
                option.dataset.tipo = 'produto';
                select.appendChild(option);
            });
        }
    }

    preencherValorItem() {
        const select = document.getElementById('itemDisponivel');
        const valorInput = document.getElementById('valorItem');
        
        if (select.selectedIndex > 0) {
            const option = select.options[select.selectedIndex];
            const valor = parseFloat(option.dataset.valor) || 0;
            valorInput.value = this.formatarMoeda(valor);
        } else {
            valorInput.value = '';
        }
    }

    adicionarItem() {
        const tipoSelect = document.getElementById('tipoItem');
        const itemSelect = document.getElementById('itemDisponivel');
        const quantidadeInput = document.getElementById('quantidadeItem');
        const valorInput = document.getElementById('valorItem');

        if (!tipoSelect.value || !itemSelect.value || !quantidadeInput.value || !valorInput.value) {
            this.mostrarNotificacao('Preencha todos os campos do item!', 'error');
            return;
        }

        const quantidade = parseInt(quantidadeInput.value);
        const valorUnitario = this.parseMoeda(valorInput.value);
        const itemOption = itemSelect.options[itemSelect.selectedIndex];

        const item = {
            id: Date.now(),
            item_id: parseInt(itemSelect.value),
            nome: itemOption.textContent,
            tipo: tipoSelect.value,
            quantidade: quantidade,
            valor_unitario: valorUnitario,
            total: quantidade * valorUnitario
        };

        this.itensVenda.push(item);
        this.renderizarItensVenda();
        this.calcularTotais();

        // Limpar campos
        tipoSelect.value = '';
        itemSelect.innerHTML = '<option value="">Selecione um item</option>';
        quantidadeInput.value = '1';
        valorInput.value = '';
    }

    removerItem(index) {
        this.itensVenda.splice(index, 1);
        this.renderizarItensVenda();
        this.calcularTotais();
    }

    renderizarItensVenda() {
        const tbody = document.getElementById('itensVendaBody');
        if (!tbody) return;

        if (this.itensVenda.length === 0) {
            tbody.innerHTML = `
                <tr class="text-center">
                    <td colspan="6" class="text-muted">Nenhum item adicionado</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.itensVenda.map((item, index) => `
            <tr>
                <td>${item.nome}</td>
                <td><span class="badge bg-${item.tipo === 'servico' ? 'primary' : 'success'}">${item.tipo}</span></td>
                <td>${item.quantidade}</td>
                <td>${this.formatarMoeda(item.valor_unitario)}</td>
                <td>${this.formatarMoeda(item.total)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="vendasManager.removerItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    calcularTotais() {
        const subtotal = this.itensVenda.reduce((sum, item) => sum + item.total, 0);
        const desconto = parseFloat(document.getElementById('descontoVenda')?.value || 0);
        const valorDesconto = (subtotal * desconto) / 100;
        const total = subtotal - valorDesconto;

        document.getElementById('subtotalVenda').textContent = this.formatarMoeda(subtotal);
        document.getElementById('valorDescontoVenda').textContent = this.formatarMoeda(valorDesconto);
        document.getElementById('totalVenda').textContent = this.formatarMoeda(total);
    }

    salvarVenda() {
        const form = document.getElementById('vendaForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (this.itensVenda.length === 0) {
            this.mostrarNotificacao('Adicione pelo menos um item à venda!', 'error');
            return;
        }

        const formData = new FormData(form);
        const subtotal = this.itensVenda.reduce((sum, item) => sum + item.total, 0);
        const desconto = parseFloat(document.getElementById('descontoVenda').value || 0);
        const valorDesconto = (subtotal * desconto) / 100;
        const total = subtotal - valorDesconto;

        const venda = {
            id: this.vendaEditando ? this.vendaEditando.id : Date.now(),
            cliente_id: parseInt(formData.get('cliente_id')),
            veiculo_id: formData.get('veiculo_id') ? parseInt(formData.get('veiculo_id')) : null,
            itens: [...this.itensVenda],
            subtotal: subtotal,
            desconto_percentual: desconto,
            desconto_valor: valorDesconto,
            total: total,
            forma_pagamento: formData.get('forma_pagamento'),
            status_pagamento: formData.get('status_pagamento'),
            observacoes: formData.get('observacoes'),
            data_venda: this.vendaEditando ? this.vendaEditando.data_venda : new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        };

        if (this.vendaEditando) {
            const index = this.vendas.findIndex(v => v.id === this.vendaEditando.id);
            this.vendas[index] = venda;
            this.mostrarNotificacao('Venda atualizada com sucesso!', 'success');
        } else {
            this.vendas.push(venda);
            this.mostrarNotificacao('Venda cadastrada com sucesso!', 'success');
        }

        this.salvarVendas();
        this.renderizarVendas();
        this.atualizarEstatisticas();
        
        // Fechar modal
        const modalElement = document.getElementById('vendaModal');
        modalElement.classList.remove('show');
    }

    renderizarVendas() {
        const tbody = document.getElementById('vendas-table-body');
        if (!tbody) return;

        if (this.vendas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4">
                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Nenhuma venda cadastrada</p>
                        <button class="btn btn-primary" onclick="vendasManager.abrirModalVenda()">
                            <i class="fas fa-plus"></i> Cadastrar Primeira Venda
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.vendas.map(venda => {
            const cliente = this.clientes.find(c => c.id === venda.cliente_id);
            const dataVenda = new Date(venda.data_venda).toLocaleDateString('pt-BR');
            
            return `
                <tr>
                    <td>#${venda.id}</td>
                    <td>${dataVenda}</td>
                    <td>
                        <div>
                            <i class="fas fa-user text-muted me-1"></i>
                            ${cliente ? cliente.nome : 'Cliente não encontrado'}
                        </div>
                        ${cliente && cliente.telefone ? `
                            <div>
                                <i class="fas fa-phone text-muted me-1"></i>
                                <small>${cliente.telefone}</small>
                            </div>
                        ` : ''}
                    </td>
                    <td>
                        <small>${venda.itens.length} item(ns)</small>
                        <div class="text-muted">
                            ${venda.itens.slice(0, 2).map(item => item.nome).join(', ')}
                            ${venda.itens.length > 2 ? '...' : ''}
                        </div>
                    </td>
                    <td>${this.formatarMoeda(venda.subtotal)}</td>
                    <td>${venda.desconto_percentual}%</td>
                    <td class="fw-bold">${this.formatarMoeda(venda.total)}</td>
                    <td>
                        <span class="badge bg-${this.getStatusPagamentoColor(venda.status_pagamento)}">
                            ${this.getStatusPagamentoLabel(venda.status_pagamento)}
                        </span>
                        <br>
                        <small class="text-muted">${this.getFormaPagamentoLabel(venda.forma_pagamento)}</small>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary" onclick="vendasManager.abrirModalVenda(${venda.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="vendasManager.visualizarVenda(${venda.id})" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="vendasManager.imprimirVenda(${venda.id})" title="Imprimir">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="vendasManager.excluirVenda(${venda.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Atualizar contador de registros
        const totalRegistros = document.getElementById('total-registros');
        if (totalRegistros) {
            totalRegistros.textContent = `${this.vendas.length} registro${this.vendas.length !== 1 ? 's' : ''}`;
        }
    }

    atualizarEstatisticas() {
        const totalVendas = document.getElementById('total-vendas');
        const faturamentoTotal = document.getElementById('faturamento-total');
        const vendasPendentes = document.getElementById('vendas-pendentes');
        const vendasHoje = document.getElementById('vendas-hoje');

        const hoje = new Date().toDateString();
        const vendasHojeCount = this.vendas.filter(v => new Date(v.data_venda).toDateString() === hoje).length;
        const faturamento = this.vendas.reduce((sum, v) => sum + v.total, 0);
        const pendentes = this.vendas.filter(v => v.status_pagamento === 'pendente').length;

        if (totalVendas) totalVendas.textContent = this.vendas.length;
        if (faturamentoTotal) faturamentoTotal.textContent = this.formatarMoeda(faturamento);
        if (vendasPendentes) vendasPendentes.textContent = pendentes;
        if (vendasHoje) vendasHoje.textContent = vendasHojeCount;
    }

    carregarFiltroClientes() {
        const select = document.getElementById('filter-cliente');
        if (!select) return;

        select.innerHTML = '<option value="">Todos os clientes</option>';
        this.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    }

    mostrarAba(aba) {
        this.abaAtiva = aba;
        
        // Atualizar botões das abas
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Ativar aba selecionada
        const abaContent = document.getElementById(`aba-${aba}`);
        if (abaContent) {
            abaContent.classList.add('active');
        }

        // Ativar botão correspondente
        const buttons = document.querySelectorAll('.tab-button');
        if (aba === 'vendas' && buttons[0]) buttons[0].classList.add('active');
        else if (aba === 'pagamentos' && buttons[1]) buttons[1].classList.add('active');
        else if (aba === 'relatorios' && buttons[2]) buttons[2].classList.add('active');

        // Carregar conteúdo da aba
        if (aba === 'pagamentos') {
            this.renderizarHistoricoPagamentos();
        } else if (aba === 'relatorios') {
            this.renderizarRelatorios();
        }
    }

    // Métodos auxiliares
    getStatusPagamentoColor(status) {
        const cores = {
            'pendente': 'warning',
            'pago': 'success',
            'parcial': 'info',
            'cancelado': 'danger'
        };
        return cores[status] || 'secondary';
    }

    getStatusPagamentoLabel(status) {
        const labels = {
            'pendente': 'Pendente',
            'pago': 'Pago',
            'parcial': 'Parcial',
            'cancelado': 'Cancelado'
        };
        return labels[status] || status;
    }

    getFormaPagamentoLabel(forma) {
        const labels = {
            'dinheiro': 'Dinheiro',
            'cartao_debito': 'Cartão Débito',
            'cartao_credito': 'Cartão Crédito',
            'pix': 'PIX',
            'transferencia': 'Transferência',
            'cheque': 'Cheque',
            'prazo': 'A Prazo'
        };
        return labels[forma] || forma;
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    parseMoeda(valor) {
        return parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    // Métodos de persistência
    carregarVendas() {
        const dados = localStorage.getItem('oficina_vendas');
        return dados ? JSON.parse(dados) : [];
    }

    carregarClientes() {
        const dados = localStorage.getItem('oficina_clientes');
        return dados ? JSON.parse(dados) : [];
    }

    carregarVeiculos() {
        const dados = localStorage.getItem('oficina_veiculos');
        return dados ? JSON.parse(dados) : [];
    }

    carregarServicos() {
        const dados = localStorage.getItem('oficina_servicos');
        return dados ? JSON.parse(dados) : [];
    }

    carregarProdutos() {
        const dados = localStorage.getItem('oficina_produtos');
        return dados ? JSON.parse(dados) : [];
    }

    salvarVendas() {
        localStorage.setItem('oficina_vendas', JSON.stringify(this.vendas));
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
        
        // Mostrar toast com CSS puro
        toastElement.style.display = 'block';
        toastElement.classList.add('show');

        // Remover toast após 3 segundos
        setTimeout(() => {
            toastElement.classList.remove('show');
            setTimeout(() => {
                toastElement.remove();
            }, 300);
        }, 3000);
    }

    // Métodos placeholder para funcionalidades futuras
    abrirModalPagamento() {
        const modalElement = document.getElementById('modal-pagamento');
        if (modalElement) {
            modalElement.classList.add('show');
        }
    }

    gerarNotaFiscal() {
        const modalElement = document.getElementById('modal-nota-fiscal');
        if (modalElement) {
            modalElement.classList.add('show');
        }
    }

    exportarVendas() {
        this.mostrarNotificacao('Funcionalidade em desenvolvimento', 'info');
    }

    gerarRelatorio() {
        this.mostrarNotificacao('Funcionalidade em desenvolvimento', 'info');
    }

    visualizarVenda(id) {
        this.mostrarNotificacao('Funcionalidade em desenvolvimento', 'info');
    }

    imprimirVenda(id) {
        this.mostrarNotificacao('Funcionalidade em desenvolvimento', 'info');
    }

    excluirVenda(id) {
        if (confirm('Tem certeza que deseja excluir esta venda?')) {
            this.vendas = this.vendas.filter(v => v.id !== id);
            this.salvarVendas();
            this.renderizarVendas();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Venda excluída com sucesso!', 'success');
        }
    }

    filtrarVendas(termo) {
        // Implementar filtro de vendas
        this.mostrarNotificacao('Filtro em desenvolvimento', 'info');
    }

    filtrarPorCliente(clienteId) {
        // Implementar filtro por cliente
        this.mostrarNotificacao('Filtro em desenvolvimento', 'info');
    }

    filtrarPorStatus(status) {
        // Implementar filtro por status
        this.mostrarNotificacao('Filtro em desenvolvimento', 'info');
    }

    filtrarPorPeriodo() {
        // Implementar filtro por período
        this.mostrarNotificacao('Filtro em desenvolvimento', 'info');
    }

    limparFiltros() {
        document.getElementById('search-venda').value = '';
        document.getElementById('filter-cliente').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('data-inicio').value = '';
        document.getElementById('data-fim').value = '';
        this.renderizarVendas();
    }

    renderizarHistoricoPagamentos() {
        // Implementar histórico de pagamentos
        this.mostrarNotificacao('Histórico de pagamentos em desenvolvimento', 'info');
    }

    renderizarRelatorios() {
        // Implementar relatórios
        this.mostrarNotificacao('Relatórios em desenvolvimento', 'info');
    }
}

// Inicializar quando o DOM estiver carregado
let vendasManager;
document.addEventListener('DOMContentLoaded', function() {
    vendasManager = new VendasManager();
});