/**
 * Gerenciador de Estoque
 * Sistema completo para controle de produtos e estoque
 */

class EstoqueManager {
    constructor() {
        this.produtos = this.carregarProdutos();
        this.produtoEditando = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderizarProdutos();
        this.atualizarEstatisticas();
    }

    bindEvents() {
        console.log('EstoqueManager: Iniciando bindEvents...');
        
        // Botão Novo Produto
        const btnNovoProduto = document.getElementById('btn-novo-produto');
        if (btnNovoProduto) {
            btnNovoProduto.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirModal();
            });
        }

        // Botão Salvar Produto
        const btnSalvarProduto = document.getElementById('salvarProduto');
        if (btnSalvarProduto) {
            btnSalvarProduto.addEventListener('click', (e) => {
                e.preventDefault();
                this.salvarProduto();
            });
        }

        // Campo de busca
        const searchInput = document.getElementById('search-produto');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filtrarProdutos(e.target.value);
            });
        }

        // Filtro por categoria
        const filterCategoria = document.getElementById('filter-categoria');
        if (filterCategoria) {
            filterCategoria.addEventListener('change', (e) => {
                this.filtrarPorCategoria(e.target.value);
            });
        }
    }

    abrirModal(produto = null) {
        this.produtoEditando = produto;
        
        if (produto) {
            this.preencherForm(produto);
        } else {
            this.limparForm();
        }

        const modal = new bootstrap.Modal(document.getElementById('produtoModal'));
        modal.show();
    }

    salvarProduto() {
        const form = document.getElementById('produtoForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const produto = {
            id: this.produtoEditando ? this.produtoEditando.id : Date.now().toString(),
            codigo: document.getElementById('codigoProduto').value,
            nome: document.getElementById('nomeProduto').value,
            descricao: document.getElementById('descricaoProduto').value,
            marca: document.getElementById('marcaProduto').value,
            categoria: document.getElementById('categoriaProduto').value,
            precoCompra: parseFloat(document.getElementById('precoCompra').value),
            precoVenda: parseFloat(document.getElementById('precoVenda').value),
            estoque: parseInt(document.getElementById('estoqueProduto').value),
            estoqueMinimo: parseInt(document.getElementById('estoqueMinimo').value),
            unidade: document.getElementById('unidadeProduto').value,
            fornecedor: document.getElementById('fornecedorProduto').value,
            localizacao: document.getElementById('localizacaoProduto').value,
            ativo: document.getElementById('statusProduto').value === 'ativo',
            dataCadastro: this.produtoEditando ? this.produtoEditando.dataCadastro : new Date().toISOString()
        };

        if (this.produtoEditando) {
            const index = this.produtos.findIndex(p => p.id === this.produtoEditando.id);
            this.produtos[index] = produto;
            this.mostrarNotificacao('Produto atualizado com sucesso!', 'success');
        } else {
            this.produtos.push(produto);
            this.mostrarNotificacao('Produto cadastrado com sucesso!', 'success');
        }

        this.salvarProdutos();
        this.renderizarProdutos();
        this.atualizarEstatisticas();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('produtoModal'));
        modal.hide();
        
        this.produtoEditando = null;
    }

    preencherForm(produto) {
        document.getElementById('codigoProduto').value = produto.codigo || '';
        document.getElementById('nomeProduto').value = produto.nome || '';
        document.getElementById('descricaoProduto').value = produto.descricao || '';
        document.getElementById('marcaProduto').value = produto.marca || '';
        document.getElementById('categoriaProduto').value = produto.categoria || '';
        document.getElementById('precoCompra').value = produto.precoCompra || '';
        document.getElementById('precoVenda').value = produto.precoVenda || '';
        document.getElementById('estoqueProduto').value = produto.estoque || '';
        document.getElementById('estoqueMinimo').value = produto.estoqueMinimo || '';
        document.getElementById('unidadeProduto').value = produto.unidade || '';
        document.getElementById('fornecedorProduto').value = produto.fornecedor || '';
        document.getElementById('localizacaoProduto').value = produto.localizacao || '';
        document.getElementById('statusProduto').value = produto.ativo ? 'ativo' : 'inativo';
    }

    limparForm() {
        const form = document.getElementById('produtoForm');
        if (form) {
            form.reset();
        }
        this.produtoEditando = null;
    }

    renderizarProdutos() {
        const tbody = document.getElementById('produtos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.produtos.forEach(produto => {
            const row = document.createElement('tr');
            row.setAttribute('data-categoria', produto.categoria);
            
            // Verificar se estoque está baixo
            const estoqueBaixo = produto.estoque <= produto.estoqueMinimo;
            
            row.innerHTML = `
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.marca}</td>
                <td>R$ ${produto.precoVenda.toFixed(2)}</td>
                <td class="${estoqueBaixo ? 'text-danger fw-bold' : ''}">
                    ${produto.estoque} ${produto.unidade}
                    ${estoqueBaixo ? '<i class="fas fa-exclamation-triangle text-warning ms-1"></i>' : ''}
                </td>
                <td>${produto.estoqueMinimo} ${produto.unidade}</td>
                <td>
                    <span class="badge ${produto.ativo ? 'bg-success' : 'bg-secondary'}">
                        ${produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="estoqueManager.editarProduto('${produto.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="estoqueManager.excluirProduto('${produto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editarProduto(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (produto) {
            this.abrirModal(produto);
        }
    }

    excluirProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.produtos = this.produtos.filter(p => p.id !== id);
            this.salvarProdutos();
            this.renderizarProdutos();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Produto excluído com sucesso!', 'success');
        }
    }

    filtrarProdutos(termo = '') {
        const categoria = document.getElementById('filter-categoria')?.value || '';
        const rows = document.querySelectorAll('#produtos-table-body tr');
        
        rows.forEach(row => {
            const codigo = row.cells[0]?.textContent.toLowerCase() || '';
            const nome = row.cells[1]?.textContent.toLowerCase() || '';
            const marca = row.cells[2]?.textContent.toLowerCase() || '';
            const categoriaServico = row.getAttribute('data-categoria')?.toLowerCase() || '';
            
            const matchTermo = !termo || 
                codigo.includes(termo.toLowerCase()) || 
                nome.includes(termo.toLowerCase()) ||
                marca.includes(termo.toLowerCase());
            const matchCategoria = !categoria || categoriaServico === categoria.toLowerCase();
            
            row.style.display = (matchTermo && matchCategoria) ? '' : 'none';
        });
    }

    filtrarPorCategoria(categoria) {
        const termo = document.getElementById('search-produto')?.value || '';
        this.filtrarProdutos(termo);
    }

    atualizarEstatisticas() {
        const totalProdutos = this.produtos.length;
        const produtosAtivos = this.produtos.filter(p => p.ativo === true).length;
        const produtosEstoqueBaixo = this.produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
        const valorTotalEstoque = this.produtos.reduce((sum, p) => sum + (p.precoVenda * p.estoque), 0);

        // Atualizar elementos da interface se existirem
        const totalElement = document.getElementById('total-produtos');
        if (totalElement) totalElement.textContent = totalProdutos;

        const ativosElement = document.getElementById('produtos-ativos');
        if (ativosElement) ativosElement.textContent = produtosAtivos;

        const estoqueBaixoElement = document.getElementById('estoque-baixo');
        if (estoqueBaixoElement) estoqueBaixoElement.textContent = produtosEstoqueBaixo;

        const valorTotalElement = document.getElementById('valor-total-estoque');
        if (valorTotalElement) valorTotalElement.textContent = `R$ ${valorTotalEstoque.toFixed(2)}`;
    }

    carregarProdutos() {
        const dados = localStorage.getItem('produtos');
        if (dados) {
            return JSON.parse(dados);
        }
        
        // Se não há dados no localStorage, carrega dados mock
        const produtosMock = [
            {
                "id": "1",
                "codigo": "OL001",
                "nome": "Óleo de motor 5W30 sintético",
                "descricao": "Óleo lubrificante sintético para motores flex",
                "marca": "Shell",
                "categoria": "oleos_lubrificantes",
                "precoCompra": 25.00,
                "precoVenda": 45.00,
                "estoque": 20,
                "estoqueMinimo": 5,
                "unidade": "litro",
                "fornecedor": "Distribuidora AutoPeças Ltda",
                "localizacao": "Prateleira A1",
                "dataCadastro": "2023-01-10T08:00:00Z",
                "ativo": true
            },
            {
                "id": "2",
                "codigo": "FL001",
                "nome": "Filtro de óleo",
                "descricao": "Filtro de óleo compatível com veículos populares",
                "marca": "Tecfil",
                "categoria": "filtros",
                "precoCompra": 12.00,
                "precoVenda": 25.00,
                "estoque": 15,
                "estoqueMinimo": 3,
                "unidade": "unidade",
                "fornecedor": "Distribuidora AutoPeças Ltda",
                "localizacao": "Prateleira B2",
                "dataCadastro": "2023-01-10T08:15:00Z",
                "ativo": true
            },
            {
                "id": "3",
                "codigo": "PF001",
                "nome": "Pastilha de freio dianteira",
                "descricao": "Jogo de pastilhas de freio para carros populares",
                "marca": "Fras-le",
                "categoria": "freios",
                "precoCompra": 45.00,
                "precoVenda": 90.00,
                "estoque": 8,
                "estoqueMinimo": 2,
                "unidade": "jogo",
                "fornecedor": "Freios Express",
                "localizacao": "Prateleira C3",
                "dataCadastro": "2023-01-15T09:30:00Z",
                "ativo": true
            },
            {
                "id": "4",
                "codigo": "AM001",
                "nome": "Amortecedor dianteiro",
                "descricao": "Amortecedor hidráulico para suspensão dianteira",
                "marca": "Monroe",
                "categoria": "suspensao",
                "precoCompra": 120.00,
                "precoVenda": 220.00,
                "estoque": 4,
                "estoqueMinimo": 2,
                "unidade": "unidade",
                "fornecedor": "Suspensão Total",
                "localizacao": "Prateleira D1",
                "dataCadastro": "2023-01-20T10:00:00Z",
                "ativo": true
            },
            {
                "id": "5",
                "codigo": "BA001",
                "nome": "Bateria 60Ah",
                "descricao": "Bateria automotiva 12V 60Ah",
                "marca": "Moura",
                "categoria": "eletrica",
                "precoCompra": 180.00,
                "precoVenda": 320.00,
                "estoque": 6,
                "estoqueMinimo": 3,
                "unidade": "unidade",
                "fornecedor": "Elétrica Automotiva",
                "localizacao": "Prateleira E2",
                "dataCadastro": "2023-01-25T11:30:00Z",
                "ativo": true
            }
        ];
        
        // Salva os dados mock no localStorage para próximas sessões
        localStorage.setItem('produtos', JSON.stringify(produtosMock));
        return produtosMock;
    }

    salvarProdutos() {
        localStorage.setItem('produtos', JSON.stringify(this.produtos));
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Implementação simples de notificação
        const alertClass = tipo === 'success' ? 'alert-success' : 
                          tipo === 'error' ? 'alert-danger' : 'alert-info';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remove automaticamente após 3 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.estoqueManager = new EstoqueManager();
});