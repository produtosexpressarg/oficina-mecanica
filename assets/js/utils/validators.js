/**
 * Sistema de Validações
 * Sistema de Gestão - Oficina Mecânica
 */

class Validator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.rules = new Map();
        
        // Registrar regras padrão
        this.registerDefaultRules();
    }
    
    /**
     * Registrar regras de validação padrão
     */
    registerDefaultRules() {
        // Regra: Campo obrigatório
        this.rules.set('required', {
            validate: (value) => {
                return value !== null && value !== undefined && value.toString().trim() !== '';
            },
            message: ERROR_MESSAGES.REQUIRED_FIELD
        });
        
        // Regra: Email válido
        this.rules.set('email', {
            validate: (value) => {
                if (!value) return true; // Opcional se não for required
                return REGEX_PATTERNS.EMAIL.test(value);
            },
            message: ERROR_MESSAGES.INVALID_EMAIL
        });
        
        // Regra: CPF válido
        this.rules.set('cpf', {
            validate: (value) => {
                if (!value) return true;
                return validateCPF(value);
            },
            message: ERROR_MESSAGES.INVALID_CPF
        });
        
        // Regra: CNPJ válido
        this.rules.set('cnpj', {
            validate: (value) => {
                if (!value) return true;
                return validateCNPJ(value);
            },
            message: ERROR_MESSAGES.INVALID_CNPJ
        });
        
        // Regra: Telefone válido
        this.rules.set('phone', {
            validate: (value) => {
                if (!value) return true;
                const cleaned = value.replace(/\D/g, '');
                return cleaned.length === 10 || cleaned.length === 11;
            },
            message: ERROR_MESSAGES.INVALID_PHONE
        });
        
        // Regra: Placa válida
        this.rules.set('plate', {
            validate: (value) => {
                if (!value) return true;
                return validatePlate(value);
            },
            message: ERROR_MESSAGES.INVALID_PLATE
        });
        
        // Regra: CEP válido
        this.rules.set('cep', {
            validate: (value) => {
                if (!value) return true;
                return REGEX_PATTERNS.CEP.test(value);
            },
            message: ERROR_MESSAGES.INVALID_CEP
        });
        
        // Regra: Data válida
        this.rules.set('date', {
            validate: (value) => {
                if (!value) return true;
                const date = new Date(value);
                return !isNaN(date.getTime());
            },
            message: ERROR_MESSAGES.INVALID_DATE
        });
        
        // Regra: Número válido
        this.rules.set('number', {
            validate: (value) => {
                if (!value) return true;
                return !isNaN(parseFloat(value)) && isFinite(value);
            },
            message: ERROR_MESSAGES.INVALID_NUMBER
        });
        
        // Regra: Tamanho mínimo
        this.rules.set('minLength', {
            validate: (value, param) => {
                if (!value) return true;
                return value.toString().length >= param;
            },
            message: (param) => `Mínimo de ${param} caracteres`
        });
        
        // Regra: Tamanho máximo
        this.rules.set('maxLength', {
            validate: (value, param) => {
                if (!value) return true;
                return value.toString().length <= param;
            },
            message: (param) => `Máximo de ${param} caracteres`
        });
        
        // Regra: Valor mínimo
        this.rules.set('min', {
            validate: (value, param) => {
                if (!value) return true;
                return parseFloat(value) >= param;
            },
            message: (param) => `Valor mínimo: ${param}`
        });
        
        // Regra: Valor máximo
        this.rules.set('max', {
            validate: (value, param) => {
                if (!value) return true;
                return parseFloat(value) <= param;
            },
            message: (param) => `Valor máximo: ${param}`
        });
    }
    
    /**
     * Validar um valor usando regras específicas
     */
    validate(value, rules, fieldName = 'Campo') {
        this.errors = [];
        this.warnings = [];
        
        if (typeof rules === 'string') {
            rules = rules.split('|');
        }
        
        for (const rule of rules) {
            const [ruleName, param] = rule.split(':');
            const ruleConfig = this.rules.get(ruleName);
            
            if (!ruleConfig) {
                console.warn(`Regra de validação não encontrada: ${ruleName}`);
                continue;
            }
            
            const isValid = ruleConfig.validate(value, param);
            
            if (!isValid) {
                const message = typeof ruleConfig.message === 'function' 
                    ? ruleConfig.message(param) 
                    : ruleConfig.message;
                    
                this.errors.push({
                    field: fieldName,
                    rule: ruleName,
                    message: message,
                    value: value
                });
            }
        }
        
        return this.errors.length === 0;
    }
    
    /**
     * Validar objeto completo usando esquema
     */
    validateObject(data, schema) {
        this.errors = [];
        this.warnings = [];
        
        for (const [fieldName, rules] of Object.entries(schema)) {
            const value = data[fieldName];
            const isValid = this.validate(value, rules, fieldName);
            
            if (!isValid) {
                // Erros já foram adicionados no método validate()
            }
        }
        
        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    
    /**
     * Validar formulário HTML
     */
    validateForm(form, schema = null) {
        this.errors = [];
        this.warnings = [];
        
        const formData = new FormData(form);
        const data = {};
        
        // Converter FormData para objeto
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Se não há esquema, usar atributos HTML5
        if (!schema) {
            schema = this.extractSchemaFromForm(form);
        }
        
        const result = this.validateObject(data, schema);
        
        // Aplicar estilos visuais nos campos
        this.applyVisualFeedback(form, result.errors);
        
        return result;
    }
    
    /**
     * Extrair esquema de validação do formulário HTML
     */
    extractSchemaFromForm(form) {
        const schema = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const rules = [];
            
            // Campo obrigatório
            if (input.hasAttribute('required')) {
                rules.push('required');
            }
            
            // Tipo de input
            switch (input.type) {
                case 'email':
                    rules.push('email');
                    break;
                case 'tel':
                    rules.push('phone');
                    break;
                case 'number':
                    rules.push('number');
                    break;
                case 'date':
                    rules.push('date');
                    break;
            }
            
            // Atributos de validação HTML5
            if (input.hasAttribute('minlength')) {
                rules.push(`minLength:${input.getAttribute('minlength')}`);
            }
            
            if (input.hasAttribute('maxlength')) {
                rules.push(`maxLength:${input.getAttribute('maxlength')}`);
            }
            
            if (input.hasAttribute('min')) {
                rules.push(`min:${input.getAttribute('min')}`);
            }
            
            if (input.hasAttribute('max')) {
                rules.push(`max:${input.getAttribute('max')}`);
            }
            
            // Atributos customizados
            if (input.hasAttribute('data-validate')) {
                rules.push(...input.getAttribute('data-validate').split('|'));
            }
            
            if (rules.length > 0) {
                schema[input.name] = rules;
            }
        });
        
        return schema;
    }
    
    /**
     * Aplicar feedback visual nos campos
     */
    applyVisualFeedback(form, errors) {
        // Remover estilos anteriores
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
            
            // Remover mensagens de erro anteriores
            const errorMsg = input.parentNode.querySelector('.invalid-feedback');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
        
        // Aplicar estilos de erro
        errors.forEach(error => {
            const input = form.querySelector(`[name="${error.field}"]`);
            if (input) {
                input.classList.add('is-invalid');
                
                // Criar mensagem de erro
                const errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = error.message;
                
                input.parentNode.appendChild(errorDiv);
            }
        });
        
        // Aplicar estilos de sucesso nos campos válidos
        inputs.forEach(input => {
            if (!input.classList.contains('is-invalid') && input.value.trim() !== '') {
                input.classList.add('is-valid');
            }
        });
    }
    
    /**
     * Registrar nova regra de validação
     */
    addRule(name, validator, message) {
        this.rules.set(name, {
            validate: validator,
            message: message
        });
    }
    
    /**
     * Obter primeiro erro
     */
    getFirstError() {
        return this.errors.length > 0 ? this.errors[0] : null;
    }
    
    /**
     * Obter todos os erros
     */
    getErrors() {
        return this.errors;
    }
    
    /**
     * Obter erros formatados para exibição
     */
    getFormattedErrors() {
        return this.errors.map(error => `${error.field}: ${error.message}`);
    }
    
    /**
     * Verificar se há erros
     */
    hasErrors() {
        return this.errors.length > 0;
    }
    
    /**
     * Limpar erros
     */
    clearErrors() {
        this.errors = [];
        this.warnings = [];
    }
}

// Esquemas de validação para entidades principais
const ValidationSchemas = {
    CLIENTE: {
        nome: 'required|minLength:2|maxLength:100',
        cpf: 'required|cpf',
        telefone: 'required|phone',
        email: 'email|maxLength:100',
        endereco: 'maxLength:200',
        cep: 'cep'
    },
    
    VEICULO: {
        clienteId: 'required',
        placa: 'required|plate',
        marca: 'required|minLength:2|maxLength:50',
        modelo: 'required|minLength:2|maxLength:50',
        ano: 'required|number|min:1900|max:2030',
        cor: 'maxLength:30',
        km: 'number|min:0'
    },
    
    SERVICO: {
        clienteId: 'required',
        veiculoId: 'required',
        descricao: 'required|minLength:10|maxLength:1000',
        dataEntrada: 'required|date',
        dataPrevista: 'date',
        valorMaoObra: 'number|min:0',
        valorPecas: 'number|min:0'
    },
    
    PRODUTO: {
        codigo: 'required|minLength:3|maxLength:20',
        nome: 'required|minLength:2|maxLength:100',
        categoria: 'required',
        quantidade: 'required|number|min:0',
        estoqueMinimo: 'number|min:0',
        precoCusto: 'number|min:0',
        precoVenda: 'required|number|min:0'
    },
    
    VENDA: {
        clienteId: 'required',
        valor: 'required|number|min:0.01',
        formaPagamento: 'required',
        data: 'required|date'
    }
};

// Validações específicas do negócio
const BusinessValidator = {
    /**
     * Validar duplicidade de CPF
     */
    validateUniqueCPF(cpf, excludeId = null) {
        const clientes = StorageManager.get(STORAGE_KEYS.CLIENTES, []);
        return !clientes.some(cliente => 
            cliente.cpf === cpf && cliente.id !== excludeId
        );
    },
    
    /**
     * Validar duplicidade de placa
     */
    validateUniquePlate(placa, excludeId = null) {
        const veiculos = StorageManager.get(STORAGE_KEYS.VEICULOS, []);
        return !veiculos.some(veiculo => 
            veiculo.placa.toUpperCase() === placa.toUpperCase() && veiculo.id !== excludeId
        );
    },
    
    /**
     * Validar duplicidade de código de produto
     */
    validateUniqueProductCode(codigo, excludeId = null) {
        const produtos = StorageManager.get(STORAGE_KEYS.PRODUTOS, []);
        return !produtos.some(produto => 
            produto.codigo.toUpperCase() === codigo.toUpperCase() && produto.id !== excludeId
        );
    },
    
    /**
     * Validar se cliente existe
     */
    validateClientExists(clienteId) {
        const clientes = StorageManager.get(STORAGE_KEYS.CLIENTES, []);
        return clientes.some(cliente => cliente.id === clienteId);
    },
    
    /**
     * Validar se veículo existe
     */
    validateVehicleExists(veiculoId) {
        const veiculos = StorageManager.get(STORAGE_KEYS.VEICULOS, []);
        return veiculos.some(veiculo => veiculo.id === veiculoId);
    },
    
    /**
     * Validar se produto existe
     */
    validateProductExists(produtoId) {
        const produtos = StorageManager.get(STORAGE_KEYS.PRODUTOS, []);
        return produtos.some(produto => produto.id === produtoId);
    },
    
    /**
     * Validar estoque suficiente
     */
    validateSufficientStock(produtoId, quantidade) {
        const produtos = StorageManager.get(STORAGE_KEYS.PRODUTOS, []);
        const produto = produtos.find(p => p.id === produtoId);
        return produto && produto.quantidade >= quantidade;
    },
    
    /**
     * Validar data não no passado
     */
    validateFutureDate(date) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= hoje;
    },
    
    /**
     * Validar margem de lucro
     */
    validateProfitMargin(precoCusto, precoVenda) {
        if (!precoCusto || !precoVenda) return true;
        return parseFloat(precoVenda) > parseFloat(precoCusto);
    }
};

// Utilitários de validação
const ValidationUtils = {
    /**
     * Sanitizar dados de entrada
     */
    sanitizeInput(data) {
        const sanitized = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                // Remover scripts e tags HTML
                sanitized[key] = value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]*>/g, '')
                    .trim();
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    },
    
    /**
     * Normalizar dados
     */
    normalizeData(data, type) {
        const normalized = { ...data };
        
        switch (type) {
            case 'cliente':
                if (normalized.cpf) normalized.cpf = formatCPF(normalized.cpf);
                if (normalized.telefone) normalized.telefone = formatPhone(normalized.telefone);
                if (normalized.cep) normalized.cep = formatCEP(normalized.cep);
                if (normalized.nome) normalized.nome = titleCase(normalized.nome);
                if (normalized.email) normalized.email = normalized.email.toLowerCase();
                break;
                
            case 'veiculo':
                if (normalized.placa) normalized.placa = formatPlate(normalized.placa);
                if (normalized.marca) normalized.marca = titleCase(normalized.marca);
                if (normalized.modelo) normalized.modelo = titleCase(normalized.modelo);
                if (normalized.cor) normalized.cor = titleCase(normalized.cor);
                break;
                
            case 'produto':
                if (normalized.codigo) normalized.codigo = normalized.codigo.toUpperCase();
                if (normalized.nome) normalized.nome = titleCase(normalized.nome);
                if (normalized.categoria) normalized.categoria = normalized.categoria.toLowerCase();
                break;
        }
        
        return normalized;
    },
    
    /**
     * Validar arquivo upload
     */
    validateFile(file, options = {}) {
        const errors = [];
        
        // Verificar se arquivo existe
        if (!file) {
            errors.push('Nenhum arquivo selecionado');
            return { isValid: false, errors };
        }
        
        // Verificar tamanho
        const maxSize = options.maxSize || SYSTEM_LIMITS.MAX_FILE_SIZE;
        if (file.size > maxSize) {
            errors.push(`Arquivo muito grande. Máximo: ${formatBytes(maxSize)}`);
        }
        
        // Verificar tipo
        if (options.allowedTypes) {
            const fileType = file.type || file.name.split('.').pop().toLowerCase();
            if (!options.allowedTypes.includes(fileType)) {
                errors.push(`Tipo de arquivo não permitido. Aceitos: ${options.allowedTypes.join(', ')}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Criar instância global do validador
const validator = new Validator();

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Validator,
        ValidationSchemas,
        BusinessValidator,
        ValidationUtils,
        validator
    };
} else {
    window.Validator = Validator;
    window.ValidationSchemas = ValidationSchemas;
    window.BusinessValidator = BusinessValidator;
    window.ValidationUtils = ValidationUtils;
    window.validator = validator;
}

console.log('✅ Sistema de validações carregado');