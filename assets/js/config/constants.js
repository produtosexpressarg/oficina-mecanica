/**
 * Constantes da Aplicação
 * Sistema de Gestão - Oficina Mecânica
 */

// Chaves do localStorage
const STORAGE_KEYS = {
    CLIENTES: 'oficina_clientes',
    VEICULOS: 'oficina_veiculos',
    SERVICOS: 'oficina_servicos',
    PRODUTOS: 'oficina_produtos',
    NOTAS_FISCAIS: 'oficina_notas_fiscais',
    VENDAS: 'oficina_vendas',
    CONFIGURACOES: 'oficina_configuracoes',
    BACKUP: 'oficina_backup',
    USER_PREFERENCES: 'oficina_user_preferences'
};

// Status possíveis para diferentes entidades
const STATUS = {
    CLIENTE: {
        ATIVO: 'ativo',
        INATIVO: 'inativo'
    },
    SERVICO: {
        PENDENTE: 'pendente',
        ANDAMENTO: 'andamento',
        CONCLUIDO: 'concluido',
        ENTREGUE: 'entregue',
        CANCELADO: 'cancelado'
    },
    PAGAMENTO: {
        PAGO: 'pago',
        PENDENTE: 'pendente',
        VENCIDO: 'vencido',
        CANCELADO: 'cancelado'
    },
    ESTOQUE: {
        NORMAL: 'normal',
        BAIXO: 'baixo',
        ZERADO: 'zerado',
        EXCESSO: 'excesso'
    },
    NOTA_FISCAL: {
        ENTRADA: 'entrada',
        SAIDA: 'saida',
        CANCELADA: 'cancelada'
    }
};

// Categorias de produtos
const CATEGORIAS_PRODUTO = {
    PECAS: 'pecas',
    FILTROS: 'filtros',
    OLEOS: 'oleos',
    PNEUS: 'pneus',
    ACESSORIOS: 'acessorios',
    FERRAMENTAS: 'ferramentas',
    OUTROS: 'outros'
};

// Formas de pagamento
const FORMAS_PAGAMENTO = {
    DINHEIRO: 'dinheiro',
    CARTAO_DEBITO: 'cartao_debito',
    CARTAO_CREDITO: 'cartao_credito',
    PIX: 'pix',
    CHEQUE: 'cheque',
    TRANSFERENCIA: 'transferencia',
    BOLETO: 'boleto'
};

// Tipos de serviço mais comuns
const TIPOS_SERVICO = {
    REVISAO: 'revisao',
    TROCA_OLEO: 'troca_oleo',
    ALINHAMENTO: 'alinhamento',
    BALANCEAMENTO: 'balanceamento',
    FREIOS: 'freios',
    SUSPENSAO: 'suspensao',
    MOTOR: 'motor',
    TRANSMISSAO: 'transmissao',
    ELETRICA: 'eletrica',
    ARREFECIMENTO: 'arrefecimento',
    COMBUSTIVEL: 'combustivel',
    ESCAPAMENTO: 'escapamento',
    OUTROS: 'outros'
};

// Configurações padrão
const DEFAULT_CONFIG = {
    // Configurações da empresa
    empresa: {
        nome: 'Oficina Mecânica',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: ''
    },
    
    // Configurações do sistema
    sistema: {
        tema: 'claro',
        idioma: 'pt-BR',
        moeda: 'BRL',
        timezone: 'America/Sao_Paulo',
        formatoData: 'dd/MM/yyyy',
        formatoHora: 'HH:mm'
    },
    
    // Configurações de estoque
    estoque: {
        alertaEstoqueMinimo: true,
        diasParaVencimento: 30,
        margemLucropadrao: 0.3 // 30%
    },
    
    // Configurações de OS
    ordemServico: {
        numeracaoAutomatica: true,
        proximoNumero: 1,
        prefixo: 'OS',
        prazoEntregaPadrao: 7 // dias
    },
    
    // Configurações de backup
    backup: {
        automatico: true,
        intervalo: 7, // dias
        ultimoBackup: null
    },
    
    // Configurações de notificação
    notificacoes: {
        servicosVencendo: true,
        estoqueMinimo: true,
        pagamentosVencidos: true,
        aniversarioClientes: true
    }
};

// Validações regex
const REGEX_PATTERNS = {
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    TELEFONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PLACA: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, // Formato antigo e Mercosul
    CEP: /^\d{5}-?\d{3}$/,
    NUMERO_NOTA: /^\d+$/,
    CODIGO_PRODUTO: /^[A-Z0-9]{3,10}$/
};

// Mensagens de erro padrão
const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'E-mail inválido',
    INVALID_CPF: 'CPF inválido',
    INVALID_CNPJ: 'CNPJ inválido',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_PLATE: 'Placa inválida',
    INVALID_CEP: 'CEP inválido',
    INVALID_DATE: 'Data inválida',
    INVALID_NUMBER: 'Número inválido',
    DUPLICATE_ENTRY: 'Este registro já existe',
    NETWORK_ERROR: 'Erro de conexão',
    SAVE_ERROR: 'Erro ao salvar dados',
    LOAD_ERROR: 'Erro ao carregar dados',
    DELETE_ERROR: 'Erro ao excluir registro',
    INSUFFICIENT_STOCK: 'Estoque insuficiente',
    INVALID_QUANTITY: 'Quantidade inválida'
};

// Mensagens de sucesso
const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: 'Dados salvos com sucesso',
    DELETE_SUCCESS: 'Registro excluído com sucesso',
    UPDATE_SUCCESS: 'Dados atualizados com sucesso',
    EXPORT_SUCCESS: 'Dados exportados com sucesso',
    IMPORT_SUCCESS: 'Dados importados com sucesso',
    BACKUP_SUCCESS: 'Backup realizado com sucesso',
    EMAIL_SENT: 'E-mail enviado com sucesso',
    PRINT_SUCCESS: 'Documento enviado para impressão'
};

// Configurações de paginação
const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_PAGE_BUTTONS: 5
};

// Configurações de filtros
const FILTER_OPTIONS = {
    DATE_RANGES: {
        TODAY: 'hoje',
        YESTERDAY: 'ontem',
        THIS_WEEK: 'esta_semana',
        LAST_WEEK: 'semana_passada',
        THIS_MONTH: 'este_mes',
        LAST_MONTH: 'mes_passado',
        THIS_YEAR: 'este_ano',
        CUSTOM: 'personalizado'
    }
};

// URLs da API (se houver backend)
const API_ENDPOINTS = {
    BASE_URL: 'http://localhost:3000/api',
    CLIENTES: '/clientes',
    VEICULOS: '/veiculos',
    SERVICOS: '/servicos',
    PRODUTOS: '/produtos',
    VENDAS: '/vendas',
    RELATORIOS: '/relatorios',
    BACKUP: '/backup',
    UPLOAD: '/upload'
};

// Configurações de exportação
const EXPORT_CONFIG = {
    FORMATS: {
        JSON: 'json',
        CSV: 'csv',
        PDF: 'pdf',
        XLSX: 'xlsx'
    },
    CSV_DELIMITER: ';',
    DATE_FORMAT: 'yyyy-MM-dd',
    ENCODING: 'utf-8'
};

// Limites do sistema
const SYSTEM_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
    MAX_RECORDS_PER_EXPORT: 10000,
    MAX_SEARCH_RESULTS: 1000,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    MAX_NOTIFICATIONS: 10
};

// Configurações de cache
const CACHE_CONFIG = {
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_SIZE: 100,       // máximo 100 itens no cache
    KEYS: {
        DASHBOARD_STATS: 'dashboard_stats',
        RECENT_SERVICES: 'recent_services',
        LOW_STOCK_ITEMS: 'low_stock_items'
    }
};

// Cores do sistema (para gráficos e status)
const SYSTEM_COLORS = {
    PRIMARY: '#3498db',
    SECONDARY: '#2c3e50',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    DANGER: '#e74c3c',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
    
    // Cores para gráficos
    CHART_COLORS: [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
    ],
    
    // Status colors
    STATUS_COLORS: {
        PENDENTE: '#f39c12',
        ANDAMENTO: '#3498db',
        CONCLUIDO: '#27ae60',
        CANCELADO: '#e74c3c',
        VENCIDO: '#e74c3c',
        NORMAL: '#27ae60',
        BAIXO: '#f39c12',
        ZERADO: '#e74c3c'
    }
};

// Configurações de impressão
const PRINT_CONFIG = {
    PAGE_SIZE: 'A4',
    ORIENTATION: 'portrait',
    MARGINS: {
        TOP: 20,
        RIGHT: 15,
        BOTTOM: 20,
        LEFT: 15
    },
    FONT_SIZE: {
        TITLE: 16,
        SUBTITLE: 14,
        BODY: 12,
        SMALL: 10
    }
};

// Atalhos do teclado
const KEYBOARD_SHORTCUTS = {
    'Ctrl+1': 'Dashboard',
    'Ctrl+2': 'Clientes',
    'Ctrl+3': 'Veículos',
    'Ctrl+4': 'Ordens de Serviço',
    'Ctrl+5': 'Estoque',
    'Ctrl+S': 'Salvar',
    'Ctrl+N': 'Novo',
    'Ctrl+F': 'Buscar',
    'Ctrl+P': 'Imprimir',
    'F1': 'Ajuda',
    'F5': 'Atualizar',
    'Escape': 'Cancelar/Fechar'
};

// Configurações de animação
const ANIMATION_CONFIG = {
    DURATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500
    },
    EASING: {
        EASE: 'ease',
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out'
    }
};

// Configurações de local storage
const STORAGE_CONFIG = {
    PREFIX: 'oficina_',
    VERSION: '1.0',
    COMPRESSION: false,
    ENCRYPTION: false
};

// Eventos customizados do sistema
const CUSTOM_EVENTS = {
    CLIENT_CREATED: 'clienteCreated',
    CLIENT_UPDATED: 'clienteUpdated',
    CLIENT_DELETED: 'clienteDeleted',
    
    VEHICLE_CREATED: 'vehicleCreated',
    VEHICLE_UPDATED: 'vehicleUpdated',
    VEHICLE_DELETED: 'vehicleDeleted',
    
    SERVICE_CREATED: 'serviceCreated',
    SERVICE_UPDATED: 'serviceUpdated',
    SERVICE_COMPLETED: 'serviceCompleted',
    
    PRODUCT_LOW_STOCK: 'productLowStock',
    PRODUCT_OUT_OF_STOCK: 'productOutOfStock',
    
    PAYMENT_OVERDUE: 'paymentOverdue',
    
    DATA_EXPORTED: 'dataExported',
    DATA_IMPORTED: 'dataImported',
    
    BACKUP_CREATED: 'backupCreated'
};

// Modelos de dados padrão
const DATA_MODELS = {
    CLIENTE: {
        id: '',
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        dataNascimento: null,
        observacoes: '',
        ativo: true,
        dataCadastro: null,
        dataAtualizacao: null
    },
    
    VEICULO: {
        id: '',
        clienteId: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: null,
        cor: '',
        km: null,
        chassi: '',
        renavam: '',
        combustivel: '',
        observacoes: '',
        dataCadastro: null,
        dataAtualizacao: null
    },
    
    SERVICO: {
        id: '',
        numero: '',
        clienteId: '',
        veiculoId: '',
        descricao: '',
        observacoes: '',
        dataEntrada: null,
        dataPrevista: null,
        dataFinalizacao: null,
        status: STATUS.SERVICO.PENDENTE,
        valorMaoObra: 0,
        valorPecas: 0,
        desconto: 0,
        valorTotal: 0,
        tecnico: '',
        itens: [],
        anexos: [],
        dataCadastro: null,
        dataAtualizacao: null
    },
    
    PRODUTO: {
        id: '',
        codigo: '',
        nome: '',
        descricao: '',
        categoria: '',
        marca: '',
        fornecedor: '',
        unidade: 'UN',
        quantidade: 0,
        estoqueMinimo: 0,
        estoqueMaximo: 0,
        precoCusto: 0,
        precoVenda: 0,
        margem: 0,
        localizacao: '',
        ativo: true,
        dataValidade: null,
        dataCadastro: null,
        dataAtualizacao: null
    }
};

// Exportar todas as constantes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        STATUS,
        CATEGORIAS_PRODUTO,
        FORMAS_PAGAMENTO,
        TIPOS_SERVICO,
        DEFAULT_CONFIG,
        REGEX_PATTERNS,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        PAGINATION,
        FILTER_OPTIONS,
        API_ENDPOINTS,
        EXPORT_CONFIG,
        SYSTEM_LIMITS,
        CACHE_CONFIG,
        SYSTEM_COLORS,
        PRINT_CONFIG,
        KEYBOARD_SHORTCUTS,
        ANIMATION_CONFIG,
        STORAGE_CONFIG,
        CUSTOM_EVENTS,
        DATA_MODELS
    };
} else {
    // Browser environment - attach to window
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.STATUS = STATUS;
    window.CATEGORIAS_PRODUTO = CATEGORIAS_PRODUTO;
    window.FORMAS_PAGAMENTO = FORMAS_PAGAMENTO;
    window.TIPOS_SERVICO = TIPOS_SERVICO;
    window.DEFAULT_CONFIG = DEFAULT_CONFIG;
    window.REGEX_PATTERNS = REGEX_PATTERNS;
    window.ERROR_MESSAGES = ERROR_MESSAGES;
    window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
    window.PAGINATION = PAGINATION;
    window.FILTER_OPTIONS = FILTER_OPTIONS;
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.EXPORT_CONFIG = EXPORT_CONFIG;
    window.SYSTEM_LIMITS = SYSTEM_LIMITS;
    window.CACHE_CONFIG = CACHE_CONFIG;
    window.SYSTEM_COLORS = SYSTEM_COLORS;
    window.PRINT_CONFIG = PRINT_CONFIG;
    window.KEYBOARD_SHORTCUTS = KEYBOARD_SHORTCUTS;
    window.ANIMATION_CONFIG = ANIMATION_CONFIG;
    window.STORAGE_CONFIG = STORAGE_CONFIG;
    window.CUSTOM_EVENTS = CUSTOM_EVENTS;
    window.DATA_MODELS = DATA_MODELS;
}

console.log('📋 Constantes da aplicação carregadas');