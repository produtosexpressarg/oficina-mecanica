/**
 * Constantes de la Aplicación
 * Sistema de Gestión - Taller Mecánico
 */

// Claves del localStorage
const STORAGE_KEYS = {
    CLIENTES: 'oficina_clientes',
    VEICULOS: 'oficina_veiculos',
    SERVICOS: 'oficina_servicos',
    PRODUTOS: 'oficina_produtos',
    NOTAS_FISCAIS: 'oficina_notas_fiscais',
    VENDAS: 'oficina_vendas',
    HISTORICO_SERVICOS: 'oficina_historico_servicos',
    CONFIGURACOES: 'oficina_configuracoes',
    BACKUP: 'oficina_backup',
    USER_PREFERENCES: 'oficina_user_preferences'
};

// Status posibles para distintas entidades
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

// Etiquetas de status para mostrar en UI
const STATUS_LABELS = {
    CLIENTE: {
        ativo: 'Activo',
        inativo: 'Inactivo'
    },
    SERVICO: {
        pendente: 'Pendiente',
        andamento: 'En Curso',
        concluido: 'Concluido',
        entregue: 'Entregado',
        cancelado: 'Cancelado'
    },
    PAGAMENTO: {
        pago: 'Pagado',
        pendente: 'Pendiente',
        vencido: 'Vencido',
        cancelado: 'Cancelado'
    },
    ESTOQUE: {
        normal: 'Normal',
        baixo: 'Bajo',
        zerado: 'Agotado',
        excesso: 'Exceso'
    },
    NOTA_FISCAL: {
        entrada: 'Entrada',
        saida: 'Salida',
        cancelada: 'Anulada'
    }
};

// Categorías de productos
const CATEGORIAS_PRODUTO = {
    PECAS: 'pecas',
    FILTROS: 'filtros',
    OLEOS: 'oleos',
    PNEUS: 'pneus',
    ACESSORIOS: 'acessorios',
    FERRAMENTAS: 'ferramentas',
    OUTROS: 'outros'
};

// Etiquetas categorías de productos
const CATEGORIAS_PRODUTO_LABELS = {
    pecas: 'Repuestos',
    filtros: 'Filtros',
    oleos: 'Aceites',
    pneus: 'Neumáticos',
    acessorios: 'Accesorios',
    ferramentas: 'Herramientas',
    outros: 'Otros'
};

// Formas de pago
const FORMAS_PAGAMENTO = {
    DINHEIRO: 'dinheiro',
    CARTAO_DEBITO: 'cartao_debito',
    CARTAO_CREDITO: 'cartao_credito',
    PIX: 'pix',
    CHEQUE: 'cheque',
    TRANSFERENCIA: 'transferencia',
    BOLETO: 'boleto'
};

// Etiquetas formas de pago (naturales Argentina)
const FORMAS_PAGAMENTO_LABELS = {
    dinheiro: 'Efectivo',
    cartao_debito: 'Débito',
    cartao_credito: 'Crédito',
    pix: 'Transf. Inmediata (CVU/CBU)',
    cheque: 'Cheque',
    transferencia: 'Transferencia Bancaria',
    boleto: 'Pago Electrónico (RapiPago / PagoMisCuentas)'
};

// Tipos de servicio más comunes
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

// Etiquetas tipos de servicio en español
const TIPOS_SERVICO_LABELS = {
    revisao: 'Revisión',
    troca_oleo: 'Cambio de Aceite',
    alinhamento: 'Alineación',
    balanceamento: 'Balanceamiento',
    freios: 'Frenos',
    suspensao: 'Suspensión',
    motor: 'Motor',
    transmissao: 'Transmisión',
    eletrica: 'Sistema Eléctrico',
    arrefecimento: 'Refrigeración',
    combustivel: 'Sistema de Combustible',
    escapamento: 'Escape',
    outros: 'Otros'
};

// Intervalos estándar de mantenimiento por tipo de servicio
// (meses = cantidad de meses para próximo servicio, km = kilometraje para próximo servicio)
// null = no aplica ese criterio para ese tipo
const INTERVALOS_MANTENIMIENTO = {
    revisao: { meses: 12, km: 20000 },
    troca_oleo: { meses: 6, km: 10000 },
    alinhamento: { meses: 12, km: 10000 },
    balanceamento: { meses: 12, km: 10000 },
    freios: { meses: 24, km: 30000 },
    suspensao: { meses: 24, km: 40000 },
    motor: { meses: 24, km: 50000 },
    transmissao: { meses: 36, km: 60000 },
    eletrica: { meses: 24, km: null },
    arrefecimento: { meses: 24, km: 40000 },
    combustivel: { meses: 24, km: 30000 },
    escapamento: { meses: null, km: 80000 },
    outros: { meses: 12, km: null }
};

// Configuraciones por defecto
const DEFAULT_CONFIG = {
    // Configuraciones de la empresa
    empresa: {
        nome: 'Taller Mecánico',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: ''
    },
    
    // Configuraciones del sistema
    sistema: {
        tema: 'claro',
        idioma: 'es-AR',
        moeda: 'ARS',
        timezone: 'America/Argentina/Buenos_Aires',
        formatoData: 'dd/MM/yyyy',
        formatoHora: 'HH:mm'
    },
    
    // Configuraciones de stock
    estoque: {
        alertaEstoqueMinimo: true,
        diasParaVencimiento: 30,
        margemLucropadrao: 0.3 // 30%
    },
    
    // Configuraciones de OS
    ordemServico: {
        numeracaoAutomatica: true,
        proximoNumero: 1,
        prefixo: 'OS',
        prazoEntregaPadrao: 7 // días
    },
    
    // Configuraciones de backup
    backup: {
        automatico: true,
        intervalo: 7, // días
        ultimoBackup: null
    },
    
    // Configuraciones de notificación
    notificacoes: {
        servicosVencendo: true,
        estoqueMinimo: true,
        pagamentosVencidos: true,
        aniversarioClientes: true
    }
};

// Validaciones regex
const REGEX_PATTERNS = {
    DNI: /^\d{2}\.?\d{3}\.?\d{3}$|^\d{2}-?\d{8}-?\d$/,
    CUIT: /^\d{2}-?\d{8}-?\d{1}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}-?\d{8}-?\d$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{2}-?\d{8}-?\d$/,
    TELEFONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PLACA: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
    CPA: /^[A-Z]?\d{4}[A-Z]{0,3}$/i,
    CEP: /^\d{5}-?\d{3}$|^[A-Z]?\d{4}[A-Z]{0,3}$/i,
    NUMERO_NOTA: /^\d+$/,
    CODIGO_PRODUTO: /^[A-Z0-9]{3,10}$/,
    CUIL_CUIT: /^\d{2}-\d{8}-\d{1}$/,
    PATENTE_AR: /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$|^[A-Z]{3}\s?\d{3}$/
};

// Mensajes de error por defecto (ES-AR)
const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Correo electrónico inválido',
    INVALID_DNI: 'DNI/CUIL inválido',
    INVALID_CUIT: 'CUIT inválido',
    INVALID_CPF: 'DNI/CUIL inválido',
    INVALID_CNPJ: 'CUIT inválido',
    INVALID_PHONE: 'Teléfono inválido',
    INVALID_PLATE: 'Patente inválida',
    INVALID_CPA: 'CPA inválido (Código Postal)',
    INVALID_CEP: 'Código Postal inválido',
    INVALID_DATE: 'Fecha inválida',
    INVALID_NUMBER: 'Número inválido',
    INVALID_KM: 'Kilometraje inválido',
    DUPLICATE_ENTRY: 'Este registro ya existe',
    NETWORK_ERROR: 'Error de conexión',
    SAVE_ERROR: 'Error al guardar los datos',
    LOAD_ERROR: 'Error al cargar los datos',
    DELETE_ERROR: 'Error al eliminar el registro',
    INSUFFICIENT_STOCK: 'Stock insuficiente',
    INVALID_QUANTITY: 'Cantidad inválida',
    VEHICULO_NOT_FOUND: 'Vehículo no encontrado',
    CLIENTE_NOT_FOUND: 'Cliente no encontrado',
    SERVICIO_REQUIRED: 'Debe seleccionar un tipo de servicio',
    FECHA_REQUIRED: 'La fecha es obligatoria',
    KM_REQUIRED: 'El kilometraje es obligatorio'
};

// Mensajes de éxito (ES-AR)
const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: 'Datos guardados correctamente',
    DELETE_SUCCESS: 'Registro eliminado correctamente',
    UPDATE_SUCCESS: 'Datos actualizados correctamente',
    EXPORT_SUCCESS: 'Datos exportados correctamente',
    IMPORT_SUCCESS: 'Datos importados correctamente',
    BACKUP_SUCCESS: 'Backup realizado correctamente',
    EMAIL_SENT: 'Correo electrónico enviado correctamente',
    PRINT_SUCCESS: 'Documento enviado a impresión',
    SERVICIO_REGISTRADO: 'Servicio registrado correctamente en el historial',
    CLIENTE_GUARDADO: 'Cliente guardado correctamente',
    VEICULO_GUARDADO: 'Vehículo guardado correctamente'
};

// Configuraciones de paginación
const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_PAGE_BUTTONS: 5
};

// Configuraciones de filtros
const FILTER_OPTIONS = {
    DATE_RANGES: {
        TODAY: 'hoy',
        YESTERDAY: 'ayer',
        THIS_WEEK: 'esta_semana',
        LAST_WEEK: 'semana_pasada',
        THIS_MONTH: 'este_mes',
        LAST_MONTH: 'mes_pasado',
        THIS_YEAR: 'este_ano',
        CUSTOM: 'personalizado'
    }
};

// URLs de la API (si hubiera backend)
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

// Configuraciones de exportación
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

// Límites del sistema
const SYSTEM_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
    MAX_RECORDS_PER_EXPORT: 10000,
    MAX_SEARCH_RESULTS: 1000,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    MAX_NOTIFICATIONS: 10
};

// Configuraciones de caché
const CACHE_CONFIG = {
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_SIZE: 100,       // máximo 100 ítems en caché
    KEYS: {
        DASHBOARD_STATS: 'dashboard_stats',
        RECENT_SERVICES: 'recent_services',
        LOW_STOCK_ITEMS: 'low_stock_items'
    }
};

// Colores del sistema (para gráficos y status)
const SYSTEM_COLORS = {
    PRIMARY: '#3498db',
    SECONDARY: '#2c3e50',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    DANGER: '#e74c3c',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
    
    // Colores para gráficos
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

// Configuraciones de impresión
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

// Atajos de teclado (etiquetas traducidas)
const KEYBOARD_SHORTCUTS = {
    'Ctrl+1': 'Panel Principal',
    'Ctrl+2': 'Clientes',
    'Ctrl+3': 'Vehículos',
    'Ctrl+4': 'Órdenes de Servicio',
    'Ctrl+5': 'Stock',
    'Ctrl+S': 'Guardar',
    'Ctrl+N': 'Nuevo',
    'Ctrl+F': 'Buscar',
    'Ctrl+P': 'Imprimir',
    'F1': 'Ayuda',
    'F5': 'Actualizar',
    'Escape': 'Cancelar/Cerrar'
};

// Configuraciones de animación
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

// Configuraciones de local storage
const STORAGE_CONFIG = {
    PREFIX: 'oficina_',
    VERSION: '1.0',
    COMPRESSION: false,
    ENCRYPTION: false
};

// Eventos personalizados del sistema
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
    
    HISTORICO_CREATED: 'historicoCreated',
    HISTORICO_UPDATED: 'historicoUpdated',
    HISTORICO_DELETED: 'historicoDeleted',
    
    PRODUCT_LOW_STOCK: 'productLowStock',
    PRODUCT_OUT_OF_STOCK: 'productOutOfStock',
    
    PAYMENT_OVERDUE: 'paymentOverdue',
    
    DATA_EXPORTED: 'dataExported',
    DATA_IMPORTED: 'dataImported',
    
    BACKUP_CREATED: 'backupCreated'
};

// Modelos de datos por defecto
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
        clienteName: '',
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
    
    HISTORICO_SERVICO: {
        id: '',
        veiculoId: '',
        fecha: null,
        servicio: '',
        km: null,
        observaciones: '',
        proximaFecha: null,
        proximoKm: null,
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

// Exportar todas las constantes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        STATUS,
        STATUS_LABELS,
        CATEGORIAS_PRODUTO,
        CATEGORIAS_PRODUTO_LABELS,
        FORMAS_PAGAMENTO,
        FORMAS_PAGAMENTO_LABELS,
        TIPOS_SERVICO,
        TIPOS_SERVICO_LABELS,
        INTERVALOS_MANTENIMIENTO,
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
    window.STATUS_LABELS = STATUS_LABELS;
    window.CATEGORIAS_PRODUTO = CATEGORIAS_PRODUTO;
    window.CATEGORIAS_PRODUTO_LABELS = CATEGORIAS_PRODUTO_LABELS;
    window.FORMAS_PAGAMENTO = FORMAS_PAGAMENTO;
    window.FORMAS_PAGAMENTO_LABELS = FORMAS_PAGAMENTO_LABELS;
    window.TIPOS_SERVICO = TIPOS_SERVICO;
    window.TIPOS_SERVICO_LABELS = TIPOS_SERVICO_LABELS;
    window.INTERVALOS_MANTENIMIENTO = INTERVALOS_MANTENIMIENTO;
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

console.log('📋 Constantes de la aplicación cargadas');
