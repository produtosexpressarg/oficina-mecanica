/**
 * Gerenciador de Serviços
 * Sistema completo para cadastro, edição e listagem de serviços
 */

class ServicosManager {
    constructor() {
        this.servicos = this.carregarServicos();
        this.servicoEditando = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderizarServicos();
        this.atualizarEstatisticas();
    }

    bindEvents() {
        console.log('ServicosManager: Iniciando bindEvents...');
        
        // Botão Novo Serviço
        const btnNovoServico = document.getElementById('btn-novo-servico');
        console.log('ServicosManager: Botão Novo Serviço encontrado:', btnNovoServico);
        
        if (btnNovoServico) {
            console.log('ServicosManager: Adicionando event listener ao botão Novo Serviço');
            btnNovoServico.addEventListener('click', (e) => {
                console.log('ServicosManager: Botão Novo Serviço clicado!');
                e.preventDefault();
                this.abrirModal();
            });
        } else {
            console.error('ServicosManager: Botão btn-novo-servico não encontrado no DOM!');
        }

        // Botão Salvar Serviço
        const btnSalvar = document.getElementById('salvarServico');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => this.salvarServico());
        } else {
            console.warn('ServicosManager: Botão salvarServico não encontrado no DOM');
        }

        // Filtros e busca
        const inputBusca = document.getElementById('search-servico');
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => this.filtrarServicos(e.target.value));
        }

        const filtroCategoria = document.getElementById('filter-categoria');
        if (filtroCategoria) {
            filtroCategoria.addEventListener('change', (e) => this.filtrarPorCategoria(e.target.value));
        }

        // Reset do modal ao fechar
        const modal = document.getElementById('servicoModal');
        if (modal) {
            // Adicionar event listener para fechar modal ao clicar no X ou fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-close')) {
                    modal.classList.remove('show');
                    this.limparForm();
                }
            });
        }
    }

    abrirModal(servico = null) {
        console.log('ServicosManager: Método abrirModal chamado com servico:', servico);
        
        this.servicoEditando = servico;
        
        const modalElement = document.getElementById('servicoModal');
        console.log('ServicosManager: Modal element encontrado:', modalElement);
        
        if (!modalElement) {
            console.error('ServicosManager: Modal servicoModal não encontrado no DOM!');
            return;
        }
        
        const modalLabel = document.getElementById('servicoModalLabel');
        console.log('ServicosManager: Modal label encontrado:', modalLabel);
        
        if (servico) {
            console.log('ServicosManager: Preenchendo modal para edição');
            this.preencherForm(servico);
            if (modalLabel) {
                modalLabel.textContent = 'Editar Serviço';
            } else {
                console.warn('ServicosManager: servicoModalLabel não encontrado');
            }
        } else {
            console.log('ServicosManager: Resetando modal para novo serviço');
            this.limparForm();
            if (modalLabel) {
                modalLabel.textContent = 'Novo Serviço';
            } else {
                console.warn('ServicosManager: servicoModalLabel não encontrado');
            }
        }
        
        console.log('ServicosManager: Tentando mostrar modal usando CSS...');
        // Usar CSS puro - adicionar classe show
        modalElement.classList.add('show');
        console.log('ServicosManager: Modal mostrado usando classe show');
    }

    salvarServico() {
        const form = document.getElementById('servicoForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const servico = {
            id: this.servicoEditando ? this.servicoEditando.id : Date.now(),
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            descricao: formData.get('descricao'),
            preco: parseFloat(formData.get('preco')),
            tempo_estimado: formData.get('tempo_estimado'),
            status: formData.get('status') || 'ativo',
            data_cadastro: this.servicoEditando ? this.servicoEditando.data_cadastro : new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        };

        if (this.servicoEditando) {
            const index = this.servicos.findIndex(s => s.id === this.servicoEditando.id);
            this.servicos[index] = servico;
            this.mostrarNotificacao('Serviço atualizado com sucesso!', 'success');
        } else {
            this.servicos.push(servico);
            this.mostrarNotificacao('Serviço cadastrado com sucesso!', 'success');
        }

        this.salvarServicos();
        this.renderizarServicos();
        this.atualizarEstatisticas();
        
        // Fechar modal usando CSS puro
        const modal = document.getElementById('servicoModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        this.servicoEditando = null;
    }

    preencherForm(servico) {
        document.getElementById('nomeServico').value = servico.nome || '';
        document.getElementById('categoriaServico').value = servico.categoria || '';
        document.getElementById('descricaoServico').value = servico.descricao || '';
        document.getElementById('precoServico').value = servico.preco || '';
        document.getElementById('tempoEstimado').value = servico.tempo_estimado || '';
        document.getElementById('statusServico').value = servico.status || 'ativo';
    }

    limparForm() {
        const form = document.getElementById('servicoForm');
        if (form) {
            form.reset();
        }
        this.servicoEditando = null;
    }

    renderizarServicos() {
        const tbody = document.getElementById('servicos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.servicos.forEach(servico => {
            const row = document.createElement('tr');
            row.setAttribute('data-categoria', servico.categoria); // Adiciona atributo para filtro
            row.innerHTML = `
                <td>${servico.id}</td>
                <td>${servico.nome}</td>
                <td>${servico.descricao}</td>
                <td>R$ ${servico.valor.toFixed(2)}</td>
                <td>${servico.tempoPrevisto} min</td>
                <td>
                    <span class="service-status status-${servico.ativo ? 'ativo' : 'inativo'}">
                        ${servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="servicosManager.editarServico('${servico.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="servicosManager.excluirServico('${servico.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editarServico(id) {
        const servico = this.servicos.find(s => s.id === id);
        if (servico) {
            this.abrirModal(servico);
        }
    }

    excluirServico(id) {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            this.servicos = this.servicos.filter(s => s.id !== id);
            this.salvarServicos();
            this.renderizarServicos();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Serviço excluído com sucesso!', 'success');
        }
    }

    filtrarServicos(termo = '') {
        const categoria = document.getElementById('filter-categoria')?.value || '';
        const rows = document.querySelectorAll('#servicos-table-body tr');
        
        rows.forEach(row => {
            const nome = row.cells[1]?.textContent.toLowerCase() || ''; // Nome está na coluna 1, não 0
            const descricao = row.cells[2]?.textContent.toLowerCase() || ''; // Descrição na coluna 2
            const categoriaServico = row.getAttribute('data-categoria')?.toLowerCase() || '';
            
            const matchTermo = !termo || 
                nome.includes(termo.toLowerCase()) || 
                descricao.includes(termo.toLowerCase());
            const matchCategoria = !categoria || categoriaServico === categoria.toLowerCase();
            
            row.style.display = (matchTermo && matchCategoria) ? '' : 'none';
        });
    }

    filtrarPorCategoria(categoria) {
        const termo = document.getElementById('search-servico')?.value || '';
        this.filtrarServicos(termo);
    }

    atualizarEstatisticas() {
        const totalServicos = this.servicos.length;
        const servicosAtivos = this.servicos.filter(s => s.ativo === true).length;
        const precoMedio = this.servicos.length > 0 
            ? this.servicos.reduce((sum, s) => sum + s.valor, 0) / this.servicos.length 
            : 0;

        // Atualizar elementos da interface se existirem
        const totalElement = document.getElementById('total-servicos');
        if (totalElement) totalElement.textContent = totalServicos;

        const ativosElement = document.getElementById('servicos-ativos');
        if (ativosElement) ativosElement.textContent = servicosAtivos;

        const precoMedioElement = document.getElementById('preco-medio');
        if (precoMedioElement) precoMedioElement.textContent = `R$ ${precoMedio.toFixed(2)}`;
    }

    carregarServicos() {
        const dados = localStorage.getItem('servicos');
        if (dados) {
            return JSON.parse(dados);
        }
        
        // Se não há dados no localStorage, carrega dados mock
        const servicosMock = [
            {
                "id": "1",
                "nome": "Troca de óleo",
                "descricao": "Troca de óleo do motor e filtro de óleo",
                "valor": 120.00,
                "tempoPrevisto": 30,
                "categoria": "manutencao_preventiva",
                "ativo": true
            },
            {
                "id": "2",
                "nome": "Alinhamento e balanceamento",
                "descricao": "Alinhamento de direção e balanceamento das rodas",
                "valor": 150.00,
                "tempoPrevisto": 60,
                "categoria": "manutencao_preventiva",
                "ativo": true
            },
            {
                "id": "3",
                "nome": "Revisão completa",
                "descricao": "Revisão completa do veículo incluindo verificação de fluidos, freios, suspensão e motor",
                "valor": 350.00,
                "tempoPrevisto": 120,
                "categoria": "manutencao_preventiva",
                "ativo": true
            },
            {
                "id": "4",
                "nome": "Troca de pastilhas de freio",
                "descricao": "Substituição das pastilhas de freio dianteiras ou traseiras",
                "valor": 180.00,
                "tempoPrevisto": 60,
                "categoria": "freios",
                "ativo": true
            },
            {
                "id": "5",
                "nome": "Troca de amortecedores",
                "descricao": "Substituição dos amortecedores dianteiros ou traseiros",
                "valor": 450.00,
                "tempoPrevisto": 120,
                "categoria": "suspensao",
                "ativo": true
            }
        ];
        
        // Salva os dados mock no localStorage para próximas sessões
        localStorage.setItem('servicos', JSON.stringify(servicosMock));
        return servicosMock;
    }

    salvarServicos() {
        localStorage.setItem('servicos', JSON.stringify(this.servicos));
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Implementar sistema de notificações
        console.log(`${tipo.toUpperCase()}: ${mensagem}`);
        
        // Criar notificação visual simples
        const notification = document.createElement('div');
        notification.className = `alert alert-${tipo === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    exportarServicos() {
        const dataStr = JSON.stringify(this.servicos, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'servicos.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Inicializar quando o DOM estiver carregado
let servicosManager;
document.addEventListener('DOMContentLoaded', function() {
    servicosManager = new ServicosManager();
});