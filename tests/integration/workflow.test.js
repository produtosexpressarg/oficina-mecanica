/**
 * HELPERS.JS
 * Funções auxiliares e utilitários para o Sistema de Gestão - Oficina Mecânica
 * Versão: 1.0.0
 */

// ===== FORMATAÇÃO E MÁSCARAS =====

/**
 * Formata CPF/CNPJ
 * @param {string} value - Valor a ser formatado
 * @returns {string} CPF/CNPJ formatado
 */
function formatCpfCnpj(value) {
    if (!value) return '';
    
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 11) {
        // CPF: 000.000.000-00
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        // CNPJ: 00.000.000/0000-00
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
}

/**
 * Formata telefone
 * @param {string} value - Número do telefone
 * @returns {string} Telefone formatado
 */
function formatPhone(value) {
    if (!value) return '';
    
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 10) {
        // (00) 0000-0000
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        // (00) 00000-0000
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
}

/**
 * Formata CEP
 * @param {string} value - CEP
 * @returns {string} CEP formatado
 */
function formatCep(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata placa de veículo (Mercosul e antiga)
 * @param {string} value - Placa
 * @returns {string} Placa formatada
 */
function formatPlaca(value) {
    if (!value) return '';
    
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (cleaned.length <= 7) {
        // Formato antigo: ABC-1234
        return cleaned.replace(/([A-Z]{3})([0-9]{4})/, '$1-$2');
    } else {
        // Formato Mercosul: ABC1D23
        return cleaned.replace(/([A-Z]{3})([0-9][A-Z][0-9]{2})/, '$1$2');
    }
}

/**
 * Formata valor monetário
 * @param {number|string} value - Valor numérico
 * @param {string} currency - Moeda (default: 'BRL')
 * @returns {string} Valor formatado
 */
function formatCurrency(value, currency = 'BRL') {
    if (value === null || value === undefined || value === '') return 'R$ 0,00';
    
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) : value;
    
    if (isNaN(numValue)) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
    }).format(numValue);
}

/**
 * Formata data para exibição
 * @param {Date|string} date - Data
 * @param {boolean} includeTime - Incluir horário
 * @returns {string} Data formatada
 */
function formatDate(date, includeTime = false) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return '';
    
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('pt-BR', options);
}

/**
 * Formata data para input HTML
 * @param {Date|string} date - Data
 * @returns {string} Data no formato YYYY-MM-DD
 */
function formatDateForInput(date) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toISOString().split('T')[0];
}

// ===== VALIDAÇÕES E UTILIDADES =====

/**
 * Gera ID único
 * @returns {string} ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Gera número sequencial para OS
 * @returns {string} Número da OS
 */
function generateOSNumber() {
    const year = new Date().getFullYear();
    const stored = localStorage.getItem('lastOSNumber') || '0';
    const nextNumber = (parseInt(stored) + 1).toString().padStart(6, '0');
    
    localStorage.setItem('lastOSNumber', nextNumber);
    return `OS${year}${nextNumber}`;
}

/**
 * Remove acentos e caracteres especiais
 * @param {string} str - String
 * @returns {string} String normalizada
 */
function normalizeString(str) {
    if (!str) return '';
    
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

/**
 * Busca em array de objetos
 * @param {Array} array - Array para buscar
 * @param {string} searchTerm - Termo de busca
 * @param {Array} fields - Campos para buscar
 * @returns {Array} Resultados filtrados
 */
function searchInArray(array, searchTerm, fields) {
    if (!searchTerm || !array?.length) return array;
    
    const normalizedTerm = normalizeString(searchTerm);
    
    return array.filter(item => {
        return fields.some(field => {
            const value = getNestedValue(item, field);
            return normalizeString(String(value || '')).includes(normalizedTerm);
        });
    });
}

/**
 * Obtém valor aninhado de objeto
 * @param {Object} obj - Objeto
 * @param {string} path - Caminho (ex: 'cliente.nome')
 * @returns {*} Valor encontrado
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Debounce para otimizar buscas
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== MANIPULAÇÃO DE DOM =====

/**
 * Adiciona event listeners com cleanup automático
 * @param {Element} element - Elemento DOM
 * @param {string} event - Tipo de evento
 * @param {Function} handler - Handler do evento
 */
function addEventListenerWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    
    // Armazena referência para cleanup
    if (!element._eventHandlers) element._eventHandlers = [];
    element._eventHandlers.push({ event, handler });
}

/**
 * Remove todos os event listeners de um elemento
 * @param {Element} element - Elemento DOM
 */
function removeAllEventListeners(element) {
    if (element._eventHandlers) {
        element._eventHandlers.forEach(({ event, handler }) => {
            element.removeEventListener(event, handler);
        });
        element._eventHandlers = [];
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Cria elemento DOM com atributos
 * @param {string} tag - Tag do elemento
 * @param {Object} attributes - Atributos
 * @param {string} content - Conteúdo interno
 * @returns {Element} Elemento criado
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'data') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

// ===== NOTIFICAÇÕES E FEEDBACK =====

/**
 * Exibe notificação toast
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (success, error, warning, info)
 * @param {number} duration - Duração em ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationsContainer') || createNotificationContainer();
    
    const toast = createElement('div', {
        class: `toast toast-${type}`,
        'data': { type }
    }, `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `);
    
    container.appendChild(toast);
    
    // Animação de entrada
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });
    
    // Remoção automática
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Cria container de notificações se não existir
 * @returns {Element} Container criado
 */
function createNotificationContainer() {
    const container = createElement('div', {
        id: 'notificationsContainer',
        class: 'notifications-container'
    });
    
    document.body.appendChild(container);
    return container;
}

/**
 * Retorna ícone para tipo de toast
 * @param {string} type - Tipo do toast
 * @returns {string} Classe do ícone
 */
function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Exibe loading overlay
 * @param {string} message - Mensagem de loading
 */
function showLoading(message = 'Carregando...') {
    const existingLoading = document.getElementById('loadingOverlay');
    if (existingLoading) return;
    
    const overlay = createElement('div', {
        id: 'loadingOverlay',
        class: 'loading-overlay active'
    }, `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${escapeHtml(message)}</p>
        </div>
    `);
    
    document.body.appendChild(overlay);
}

/**
 * Remove loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('loading-hide');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ===== EXPORTAÇÃO E IMPORTAÇÃO =====

/**
 * Exporta dados para JSON
 * @param {Object} data - Dados para exportar
 * @param {string} filename - Nome do arquivo
 */
function exportToJSON(data, filename = 'backup-oficina.json') {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = createElement('a', {
            href: url,
            download: `${filename}-${formatDate(new Date()).replace(/\//g, '-')}.json`
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar:', error);
        showToast('Erro ao exportar dados', 'error');
    }
}

/**
 * Importa dados de arquivo JSON
 * @param {Function} callback - Callback com dados importados
 */
function importFromJSON(callback) {
    const input = createElement('input', {
        type: 'file',
        accept: '.json',
        style: 'display: none'
    });
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                callback(data);
                showToast('Dados importados com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao importar:', error);
                showToast('Erro ao ler arquivo. Verifique se é um JSON válido.', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// ===== CÁLCULOS E ESTATÍSTICAS =====

/**
 * Calcula estatísticas básicas de array numérico
 * @param {Array} numbers - Array de números
 * @returns {Object} Estatísticas
 */
function calculateStats(numbers) {
    if (!numbers?.length) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
    
    const validNumbers = numbers.filter(n => !isNaN(n) && n !== null && n !== undefined);
    
    if (!validNumbers.length) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
    
    const sum = validNumbers.reduce((acc, n) => acc + Number(n), 0);
    const avg = sum / validNumbers.length;
    const min = Math.min(...validNumbers);
    const max = Math.max(...validNumbers);
    
    return {
        sum,
        avg: Math.round(avg * 100) / 100,
        min,
        max,
        count: validNumbers.length
    };
}

/**
 * Agrupa array por propriedade
 * @param {Array} array - Array para agrupar
 * @param {string} key - Propriedade para agrupamento
 * @returns {Object} Objeto agrupado
 */
function groupBy(array, key) {
    if (!array?.length) return {};
    
    return array.reduce((groups, item) => {
        const group = getNestedValue(item, key) || 'Não definido';
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

/**
 * Filtra dados por período
 * @param {Array} data - Dados para filtrar
 * @param {string} dateField - Campo de data
 * @param {string} period - Período (hoje, semana, mes, ano)
 * @returns {Array} Dados filtrados
 */
function filterByPeriod(data, dateField, period) {
    if (!data?.length) return [];
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let startDate, endDate;
    
    switch (period) {
        case 'hoje':
            startDate = startOfDay;
            endDate = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'semana':
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
            startDate = startOfWeek;
            endDate = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'mes':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        case 'ano':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear() + 1, 0, 1);
            break;
        default:
            return data;
    }
    
    return data.filter(item => {
        const itemDate = new Date(getNestedValue(item, dateField));
        return itemDate >= startDate && itemDate < endDate;
    });
}

// ===== UTILITÁRIOS DE PERFORMANCE =====

/**
 * Throttle para otimizar eventos frequentes
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} Função com throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Memoização simples para cache de funções
 * @param {Function} fn - Função a ser memoizada
 * @returns {Function} Função memoizada
 */
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// ===== EXPORTAÇÕES =====

// Disponibiliza funções globalmente
window.OficinaHelpers = {
    // Formatação
    formatCpfCnpj,
    formatPhone,
    formatCep,
    formatPlaca,
    formatCurrency,
    formatDate,
    formatDateForInput,
    
    // Utilidades
    generateId,
    generateOSNumber,
    normalizeString,
    searchInArray,
    getNestedValue,
    debounce,
    throttle,
    memoize,
    
    // DOM
    addEventListenerWithCleanup,
    removeAllEventListeners,
    escapeHtml,
    createElement,
    
    // Notificações
    showToast,
    showLoading,
    hideLoading,
    
    // Dados
    exportToJSON,
    importFromJSON,
    calculateStats,
    groupBy,
    filterByPeriod
};

console.log('✅ Helpers.js carregado com sucesso');