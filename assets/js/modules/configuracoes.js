/**
 * Módulo de Configurações
 * Sistema de Gestão - Oficina Mecânica
 */

class ConfiguracoesModule {
    constructor() {
        this.configuracoes = {
            empresa: {
                nome: 'Oficina Mecânica LTDA',
                cnpj: '12.345.678/0001-90',
                endereco: 'Rua das Oficinas, 123',
                cidade: 'São Paulo',
                telefone: '(11) 1234-5678',
                email: 'contato@oficinamecanica.com'
            },
            sistema: {
                tema: 'claro',
                idioma: 'pt-BR',
                moeda: 'BRL',
                timezone: 'America/Sao_Paulo'
            },
            notificacoes: {
                email: true,
                push: true,
                estoqueBaixo: true,
                vencimentoOS: true
            }
        };
    }

    /**
     * Carregar configurações
     */
    carregarConfiguracoes() {
        const configSalvas = localStorage.getItem('oficina_configuracoes');
        if (configSalvas) {
            this.configuracoes = { ...this.configuracoes, ...JSON.parse(configSalvas) };
        }
        return this.configuracoes;
    }

    /**
     * Salvar configurações
     */
    salvarConfiguracoes(novasConfiguracoes) {
        this.configuracoes = { ...this.configuracoes, ...novasConfiguracoes };
        localStorage.setItem('oficina_configuracoes', JSON.stringify(this.configuracoes));
        
        // Aplicar configurações imediatamente
        this.aplicarConfiguracoes();
        
        return true;
    }

    /**
     * Aplicar configurações no sistema
     */
    aplicarConfiguracoes() {
        // Aplicar tema
        if (this.configuracoes.sistema.tema === 'escuro') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Aplicar outras configurações conforme necessário
        console.log('Configurações aplicadas:', this.configuracoes);
    }

    /**
     * Resetar configurações para padrão
     */
    resetarConfiguracoes() {
        localStorage.removeItem('oficina_configuracoes');
        this.carregarConfiguracoes();
        this.aplicarConfiguracoes();
        return true;
    }

    /**
     * Obter configuração específica
     */
    obterConfiguracao(chave) {
        const chaves = chave.split('.');
        let valor = this.configuracoes;
        
        for (const k of chaves) {
            if (valor && typeof valor === 'object' && k in valor) {
                valor = valor[k];
            } else {
                return null;
            }
        }
        
        return valor;
    }

    /**
     * Definir configuração específica
     */
    definirConfiguracao(chave, valor) {
        const chaves = chave.split('.');
        let obj = this.configuracoes;
        
        for (let i = 0; i < chaves.length - 1; i++) {
            const k = chaves[i];
            if (!(k in obj) || typeof obj[k] !== 'object') {
                obj[k] = {};
            }
            obj = obj[k];
        }
        
        obj[chaves[chaves.length - 1]] = valor;
        this.salvarConfiguracoes(this.configuracoes);
        
        return true;
    }
}

// Exportar para uso global
window.ConfiguracoesModule = ConfiguracoesModule;

// Inicializar módulo
if (typeof window !== 'undefined') {
    window.configuracoes = new ConfiguracoesModule();
    window.configuracoes.carregarConfiguracoes();
    window.configuracoes.aplicarConfiguracoes();
}