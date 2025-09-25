/**
 * Módulo Financeiro
 * Sistema de Gestão - Oficina Mecânica
 */

class FinanceiroModule {
    constructor() {
        this.contasReceber = [];
        this.contasPagar = [];
        this.fluxoCaixa = [];
        this.categorias = {
            receitas: ['Vendas', 'Serviços', 'Outros'],
            despesas: ['Aluguel', 'Energia', 'Telefone', 'Materiais', 'Salários', 'Impostos', 'Outros']
        };
    }

    /**
     * Adicionar conta a receber
     */
    adicionarContaReceber(conta) {
        const novaConta = {
            id: Date.now(),
            cliente: conta.cliente,
            descricao: conta.descricao,
            valor: parseFloat(conta.valor),
            dataVencimento: conta.dataVencimento,
            dataPagamento: conta.dataPagamento || null,
            status: conta.dataPagamento ? 'pago' : 'pendente',
            categoria: conta.categoria || 'Vendas',
            observacoes: conta.observacoes || '',
            criadoEm: new Date().toISOString()
        };

        this.contasReceber.push(novaConta);
        this.salvarDados();
        return novaConta;
    }

    /**
     * Adicionar conta a pagar
     */
    adicionarContaPagar(conta) {
        const novaConta = {
            id: Date.now(),
            fornecedor: conta.fornecedor,
            descricao: conta.descricao,
            valor: parseFloat(conta.valor),
            dataVencimento: conta.dataVencimento,
            dataPagamento: conta.dataPagamento || null,
            status: conta.dataPagamento ? 'pago' : 'pendente',
            categoria: conta.categoria || 'Outros',
            observacoes: conta.observacoes || '',
            criadoEm: new Date().toISOString()
        };

        this.contasPagar.push(novaConta);
        this.salvarDados();
        return novaConta;
    }

    /**
     * Marcar conta como paga
     */
    marcarComoPaga(tipo, id, dataPagamento = null) {
        const lista = tipo === 'receber' ? this.contasReceber : this.contasPagar;
        const conta = lista.find(c => c.id === id);
        
        if (conta) {
            conta.status = 'pago';
            conta.dataPagamento = dataPagamento || new Date().toISOString().split('T')[0];
            
            // Adicionar ao fluxo de caixa
            this.adicionarFluxoCaixa({
                tipo: tipo === 'receber' ? 'entrada' : 'saida',
                valor: conta.valor,
                descricao: conta.descricao,
                categoria: conta.categoria,
                data: conta.dataPagamento
            });
            
            this.salvarDados();
            return true;
        }
        return false;
    }

    /**
     * Adicionar entrada no fluxo de caixa
     */
    adicionarFluxoCaixa(entrada) {
        const novaEntrada = {
            id: Date.now(),
            tipo: entrada.tipo, // 'entrada' ou 'saida'
            valor: parseFloat(entrada.valor),
            descricao: entrada.descricao,
            categoria: entrada.categoria,
            data: entrada.data || new Date().toISOString().split('T')[0],
            criadoEm: new Date().toISOString()
        };

        this.fluxoCaixa.push(novaEntrada);
        this.salvarDados();
        return novaEntrada;
    }

    /**
     * Obter contas a receber
     */
    obterContasReceber(filtros = {}) {
        let contas = [...this.contasReceber];

        if (filtros.status) {
            contas = contas.filter(c => c.status === filtros.status);
        }

        if (filtros.dataInicio && filtros.dataFim) {
            contas = contas.filter(c => 
                c.dataVencimento >= filtros.dataInicio && 
                c.dataVencimento <= filtros.dataFim
            );
        }

        return contas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    }

    /**
     * Obter contas a pagar
     */
    obterContasPagar(filtros = {}) {
        let contas = [...this.contasPagar];

        if (filtros.status) {
            contas = contas.filter(c => c.status === filtros.status);
        }

        if (filtros.dataInicio && filtros.dataFim) {
            contas = contas.filter(c => 
                c.dataVencimento >= filtros.dataInicio && 
                c.dataVencimento <= filtros.dataFim
            );
        }

        return contas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    }

    /**
     * Obter fluxo de caixa
     */
    obterFluxoCaixa(dataInicio, dataFim) {
        let fluxo = [...this.fluxoCaixa];

        if (dataInicio && dataFim) {
            fluxo = fluxo.filter(f => f.data >= dataInicio && f.data <= dataFim);
        }

        return fluxo.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    /**
     * Calcular resumo financeiro
     */
    calcularResumoFinanceiro(dataInicio, dataFim) {
        const contasReceber = this.obterContasReceber({ dataInicio, dataFim });
        const contasPagar = this.obterContasPagar({ dataInicio, dataFim });
        const fluxo = this.obterFluxoCaixa(dataInicio, dataFim);

        const totalReceber = contasReceber
            .filter(c => c.status === 'pendente')
            .reduce((sum, c) => sum + c.valor, 0);

        const totalPagar = contasPagar
            .filter(c => c.status === 'pendente')
            .reduce((sum, c) => sum + c.valor, 0);

        const totalEntradas = fluxo
            .filter(f => f.tipo === 'entrada')
            .reduce((sum, f) => sum + f.valor, 0);

        const totalSaidas = fluxo
            .filter(f => f.tipo === 'saida')
            .reduce((sum, f) => sum + f.valor, 0);

        return {
            contasReceber: {
                total: totalReceber,
                quantidade: contasReceber.filter(c => c.status === 'pendente').length
            },
            contasPagar: {
                total: totalPagar,
                quantidade: contasPagar.filter(c => c.status === 'pendente').length
            },
            fluxoCaixa: {
                entradas: totalEntradas,
                saidas: totalSaidas,
                saldo: totalEntradas - totalSaidas
            },
            saldoProjetado: totalReceber - totalPagar
        };
    }

    /**
     * Obter contas vencidas
     */
    obterContasVencidas() {
        const hoje = new Date().toISOString().split('T')[0];
        
        const receberVencidas = this.contasReceber.filter(c => 
            c.status === 'pendente' && c.dataVencimento < hoje
        );

        const pagarVencidas = this.contasPagar.filter(c => 
            c.status === 'pendente' && c.dataVencimento < hoje
        );

        return {
            receber: receberVencidas,
            pagar: pagarVencidas,
            totalReceber: receberVencidas.reduce((sum, c) => sum + c.valor, 0),
            totalPagar: pagarVencidas.reduce((sum, c) => sum + c.valor, 0)
        };
    }

    /**
     * Obter contas a vencer (próximos 30 dias)
     */
    obterContasAVencer(dias = 30) {
        const hoje = new Date();
        const dataLimite = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000))
            .toISOString().split('T')[0];
        const hojeStr = hoje.toISOString().split('T')[0];

        const receberAVencer = this.contasReceber.filter(c => 
            c.status === 'pendente' && 
            c.dataVencimento >= hojeStr && 
            c.dataVencimento <= dataLimite
        );

        const pagarAVencer = this.contasPagar.filter(c => 
            c.status === 'pendente' && 
            c.dataVencimento >= hojeStr && 
            c.dataVencimento <= dataLimite
        );

        return {
            receber: receberAVencer,
            pagar: pagarAVencer,
            totalReceber: receberAVencer.reduce((sum, c) => sum + c.valor, 0),
            totalPagar: pagarAVencer.reduce((sum, c) => sum + c.valor, 0)
        };
    }

    /**
     * Salvar dados no localStorage
     */
    salvarDados() {
        const dados = {
            contasReceber: this.contasReceber,
            contasPagar: this.contasPagar,
            fluxoCaixa: this.fluxoCaixa
        };
        localStorage.setItem('oficina_financeiro', JSON.stringify(dados));
    }

    /**
     * Carregar dados do localStorage
     */
    carregarDados() {
        const dados = localStorage.getItem('oficina_financeiro');
        if (dados) {
            const dadosParseados = JSON.parse(dados);
            this.contasReceber = dadosParseados.contasReceber || [];
            this.contasPagar = dadosParseados.contasPagar || [];
            this.fluxoCaixa = dadosParseados.fluxoCaixa || [];
        } else {
            // Dados de exemplo para demonstração
            this.carregarDadosExemplo();
        }
    }

    /**
     * Carregar dados de exemplo
     */
    carregarDadosExemplo() {
        const hoje = new Date();
        const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
        const proximaSemana = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Contas a receber de exemplo
        this.contasReceber = [
            {
                id: 1,
                cliente: 'João Silva',
                descricao: 'Serviço de revisão - Civic 2020',
                valor: 450.00,
                dataVencimento: amanha.toISOString().split('T')[0],
                status: 'pendente',
                categoria: 'Serviços'
            },
            {
                id: 2,
                cliente: 'Maria Santos',
                descricao: 'Venda de pneus',
                valor: 800.00,
                dataVencimento: proximaSemana.toISOString().split('T')[0],
                status: 'pendente',
                categoria: 'Vendas'
            }
        ];

        // Contas a pagar de exemplo
        this.contasPagar = [
            {
                id: 1,
                fornecedor: 'Distribuidora de Peças',
                descricao: 'Compra de filtros e óleos',
                valor: 1200.00,
                dataVencimento: proximaSemana.toISOString().split('T')[0],
                status: 'pendente',
                categoria: 'Materiais'
            }
        ];

        this.salvarDados();
    }
}

// Exportar para uso global
window.FinanceiroModule = FinanceiroModule;

// Inicializar módulo
if (typeof window !== 'undefined') {
    window.financeiro = new FinanceiroModule();
    window.financeiro.carregarDados();
}