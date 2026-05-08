class EmbarquesManager {
    constructor() {
        this.embarques = this.carregarEmbarques();
        this.embarqueEditando = null;
        this.bindEvents();
        this.renderizarTabela();
    }

    bindEvents() {
        const btnNovo = document.getElementById('btn-novo-embarque');
        const btnSalvar = document.getElementById('salvarEmbarque');
        const btnCancelar = document.getElementById('cancelarEmbarque');
        const btnFechar = document.getElementById('fecharModal');
        const filtroModo = document.getElementById('filtroModo');
        const filtroStatus = document.getElementById('filtroStatus');

        if (btnNovo) btnNovo.addEventListener('click', () => this.abrirModal());
        if (btnSalvar) btnSalvar.addEventListener('click', (e) => { e.preventDefault(); this.salvarEmbarque(); });
        if (btnCancelar) btnCancelar.addEventListener('click', () => this.fecharModal());
        if (btnFechar) btnFechar.addEventListener('click', () => this.fecharModal());
        if (filtroModo) filtroModo.addEventListener('change', () => this.renderizarTabela());
        if (filtroStatus) filtroStatus.addEventListener('change', () => this.renderizarTabela());
    }

    abrirModal(embarque = null) {
        this.embarqueEditando = embarque;
        const modal = document.getElementById('embarqueModal');
        const label = document.getElementById('embarqueModalLabel');
        if (!modal) return;

        document.getElementById('embarqueForm').reset();
        if (embarque) {
            label.textContent = 'Editar Embarque';
            document.getElementById('tipoEmbarque').value = embarque.tipo || '';
            document.getElementById('modoEmbarque').value = embarque.modo || '';
            document.getElementById('incoterm').value = embarque.incoterm || '';
            document.getElementById('numeroDocumento').value = embarque.numeroDocumento || '';
            document.getElementById('clienteEmbarque').value = embarque.cliente || '';
            document.getElementById('fornecedorEmbarque').value = embarque.fornecedor || '';
            document.getElementById('origemEmbarque').value = embarque.origem || '';
            document.getElementById('destinoEmbarque').value = embarque.destino || '';
            document.getElementById('etaEmbarque').value = embarque.eta || '';
            document.getElementById('statusEmbarque').value = embarque.status || 'planejado';
            document.getElementById('observacoesEmbarque').value = embarque.observacoes || '';
        } else {
            label.textContent = 'Novo Embarque';
        }

        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    fecharModal() {
        const modal = document.getElementById('embarqueModal');
        if (!modal) return;
        modal.classList.remove('show');
        modal.style.display = 'none';
        this.embarqueEditando = null;
    }

    salvarEnbarqueValidado(dados) {
        // utilitário opcional para validar regras específicas futuramente
        return true;
    }

    salvarEmbarque() {
        const form = document.getElementById('embarqueForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const embarque = {
            id: this.embarqueEditando ? this.embarqueEditando.id : Date.now(),
            tipo: document.getElementById('tipoEmbarque').value,
            modo: document.getElementById('modoEmbarque').value,
            incoterm: document.getElementById('incoterm').value,
            numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
            cliente: document.getElementById('clienteEmbarque').value.trim(),
            fornecedor: document.getElementById('fornecedorEmbarque').value.trim(),
            origem: document.getElementById('origemEmbarque').value.trim(),
            destino: document.getElementById('destinoEmbarque').value.trim(),
            eta: document.getElementById('etaEmbarque').value,
            status: document.getElementById('statusEmbarque').value,
            observacoes: document.getElementById('observacoesEmbarque').value.trim(),
            atualizado_em: new Date().toISOString(),
            criado_em: this.embarqueEditando ? this.embarqueEditando.criado_em : new Date().toISOString()
        };

        if (this.embarqueEditando) {
            const idx = this.embarques.findIndex(e => e.id === this.embarqueEditando.id);
            if (idx !== -1) this.embarques[idx] = embarque;
        } else {
            this.embarques.unshift(embarque);
        }
        this.salvarEmbarques();
        this.renderizarTabela();
        this.fecharModal();
    }

    excluirEmbarque(id) {
        if (!confirm('Deseja realmente excluir este embarque?')) return;
        this.embarques = this.embarques.filter(e => e.id !== id);
        this.salvarEmbarques();
        this.renderizarTabela();
    }

    carregarEmbarques() {
        const dados = localStorage.getItem('comex_embarques');
        return dados ? JSON.parse(dados) : [];
    }

    salvarEmbarques() {
        localStorage.setItem('comex_embarques', JSON.stringify(this.embarques));
    }

    filtrar(embarques) {
        const modo = document.getElementById('filtroModo')?.value || '';
        const status = document.getElementById('filtroStatus')?.value || '';
        return embarques.filter(e => {
            const okModo = modo ? e.modo === modo : true;
            const okStatus = status ? e.status === status : true;
            return okModo && okStatus;
        });
    }

    renderizarTabela() {
        const tbody = document.querySelector('#tabela-embarques tbody');
        if (!tbody) return;
        const dados = this.filtrar(this.embarques);
        if (dados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="muted">Nenhum embarque encontrado</td></tr>`;
            return;
        }
        tbody.innerHTML = dados.map(e => `
            <tr>
                <td>${e.numeroDocumento || '-'}</td>
                <td class="muted">${e.tipo === 'importacao' ? 'Importação' : 'Exportação'}</td>
                <td>${e.modo}</td>
                <td>${e.incoterm}</td>
                <td>${e.cliente}</td>
                <td>${e.fornecedor}</td>
                <td>${e.origem} → ${e.destino}</td>
                <td>${e.eta || '-'}</td>
                <td><span class="badge ${e.status === 'finalizado' ? 'success' : e.status === 'em_transito' ? 'info' : e.status === 'planejado' ? 'warning' : 'gray'}">${this.formatarStatus(e.status)}</span></td>
                <td>
                    <button class="btn" onclick="app.abrirModalEditar(${e.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn" onclick="app.excluirEmbarque(${e.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    formatarStatus(s) {
        switch(s){
            case 'planejado': return 'Planejado';
            case 'em_transito': return 'Em trânsito';
            case 'liberacao': return 'Liberação';
            case 'finalizado': return 'Finalizado';
            case 'cancelado': return 'Cancelado';
            default: return s;
        }
    }

    abrirModalEditar(id) {
        const embarque = this.embarques.find(e => e.id === id);
        if (embarque) this.abrirModal(embarque);
    }
}

// bootstrap
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EmbarquesManager();
});