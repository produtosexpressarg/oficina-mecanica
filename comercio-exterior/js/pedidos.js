class PedidosManager {
    constructor() {
        this.pedidos = this.carregarPedidos();
        this.pedidoEditando = null;
        this.bindEvents();
        this.renderizarTabela();
    }

    bindEvents() {
        const btnNovo = document.getElementById('btn-novo-pedido');
        const btnSalvar = document.getElementById('salvarPedido');
        const btnCancelar = document.getElementById('cancelarPedido');
        const btnFechar = document.getElementById('fecharPedidoModal');
        const filtroStatus = document.getElementById('filtroStatusPedido');

        if (btnNovo) btnNovo.addEventListener('click', () => this.abrirModal());
        if (btnSalvar) btnSalvar.addEventListener('click', (e) => { e.preventDefault(); this.salvarPedido(); });
        if (btnCancelar) btnCancelar.addEventListener('click', () => this.fecharModal());
        if (btnFechar) btnFechar.addEventListener('click', () => this.fecharModal());
        if (filtroStatus) filtroStatus.addEventListener('change', () => this.renderizarTabela());
    }

    abrirModal(pedido = null) {
        this.pedidoEditando = pedido;
        const modal = document.getElementById('pedidoModal');
        const label = document.getElementById('pedidoModalLabel');
        if (!modal) return;
        document.getElementById('pedidoForm')?.reset();
        if (pedido) {
            label.textContent = 'Editar Pedido';
            document.getElementById('numeroPedido').value = pedido.numero || '';
            document.getElementById('tipoPedido').value = pedido.tipo || '';
            document.getElementById('incotermPedido').value = pedido.incoterm || '';
            document.getElementById('clientePedido').value = pedido.cliente || '';
            document.getElementById('fornecedorPedido').value = pedido.fornecedor || '';
            document.getElementById('moedaPedido').value = pedido.moeda || 'USD';
            document.getElementById('valorPedido').value = pedido.valor || '';
            document.getElementById('dataPedido').value = pedido.data || '';
            document.getElementById('statusPedido').value = pedido.status || 'em_aberto';
            document.getElementById('observacoesPedido').value = pedido.observacoes || '';
        } else {
            label.textContent = 'Novo Pedido';
        }
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    fecharModal() {
        const modal = document.getElementById('pedidoModal');
        if (!modal) return;
        modal.classList.remove('show');
        modal.style.display = 'none';
        this.pedidoEditando = null;
    }

    salvarPedido() {
        const form = document.getElementById('pedidoForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const pedido = {
            id: this.pedidoEditando ? this.pedidoEditando.id : Date.now(),
            numero: document.getElementById('numeroPedido').value.trim(),
            tipo: document.getElementById('tipoPedido').value,
            incoterm: document.getElementById('incotermPedido').value,
            cliente: document.getElementById('clientePedido').value.trim(),
            fornecedor: document.getElementById('fornecedorPedido').value.trim(),
            moeda: document.getElementById('moedaPedido').value,
            valor: parseFloat(document.getElementById('valorPedido').value || '0'),
            data: document.getElementById('dataPedido').value,
            status: document.getElementById('statusPedido').value,
            observacoes: document.getElementById('observacoesPedido').value.trim(),
            atualizado_em: new Date().toISOString(),
            criado_em: this.pedidoEditando ? this.pedidoEditando.criado_em : new Date().toISOString()
        };
        if (this.pedidoEditando) {
            const idx = this.pedidos.findIndex(p => p.id === this.pedidoEditando.id);
            if (idx !== -1) this.pedidos[idx] = pedido;
        } else {
            this.pedidos.unshift(pedido);
        }
        this.salvarPedidos();
        this.renderizarTabela();
        this.fecharModal();
    }

    excluirPedido(id) {
        if (!confirm('Deseja realmente excluir este pedido?')) return;
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.salvarPedidos();
        this.renderizarTabela();
    }

    carregarPedidos() {
        const dados = localStorage.getItem('comex_pedidos');
        return dados ? JSON.parse(dados) : [];
    }

    salvarPedidos() {
        localStorage.setItem('comex_pedidos', JSON.stringify(this.pedidos));
    }

    filtrar(pedidos) {
        const status = document.getElementById('filtroStatusPedido')?.value || '';
        return pedidos.filter(p => status ? p.status === status : true);
    }

    renderizarTabela() {
        const tbody = document.querySelector('#tabela-pedidos tbody');
        if (!tbody) return;
        const dados = this.filtrar(this.pedidos);
        if (dados.length === 0) { tbody.innerHTML = '<tr><td colspan="10" class="muted">Nenhum pedido encontrado</td></tr>'; return; }
        tbody.innerHTML = dados.map(p => `
            <tr>
                <td>${p.numero || '-'}</td>
                <td class="muted">${p.tipo === 'compra' ? 'Compra' : 'Venda'}</td>
                <td>${p.incoterm}</td>
                <td>${p.cliente}</td>
                <td>${p.fornecedor}</td>
                <td>${p.moeda}</td>
                <td>${(p.valor || 0).toLocaleString('pt-BR', { style:'currency', currency: p.moeda || 'USD' })}</td>
                <td>${p.data || '-'}</td>
                <td>${this.formatarStatus(p.status)}</td>
                <td>
                    <button class="btn" onclick="pedidosApp.abrirModalEditar(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn" onclick="pedidosApp.excluirPedido(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    formatarStatus(s){
        switch(s){
            case 'em_aberto': return 'Em aberto';
            case 'aprovado': return 'Aprovado';
            case 'faturado': return 'Faturado';
            case 'cancelado': return 'Cancelado';
            default: return s;
        }
    }

    abrirModalEditar(id){
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) this.abrirModal(pedido);
    }
}

let pedidosApp;
document.addEventListener('DOMContentLoaded', () => {
    pedidosApp = new PedidosManager();
});