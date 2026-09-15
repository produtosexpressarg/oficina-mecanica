/**
 * HELPERS.JS
 * Funciones auxiliares y utilitarios para Sistema de Gestión Taller Mecánico
 * Versión: 2.0.0 (ES-AR)
 */

// ===== FORMATO Y MÁSCARAS (ARGENTINA) =====

/**
 * Formatea DNI/CUIT/CUIL (versión Argentina)
 * @param {string} value - Valor numérico
 * @returns {string} Valor formateado
 */
function formatCpfCnpj(value) { return formatDniCuit(value); }
function formatDniCuit(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 8) {
        // DNI: 12.345.678
        return digits.replace(/(\d{2})(\d{3})(\d{0,3})/, (m, a, b, c) =>
            c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a);
    } else if (digits.length === 11) {
        // CUIT/CUIL: 00-00000000-0
        return digits.slice(0,2) + '-' + digits.slice(2,10) + '-' + digits.slice(10);
    } else {
        // Fallback (formatos largos):
        if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}
/** @deprecated alias ES-AR */
const formatDNI = formatDniCuit;
const formatCUIT = formatDniCuit;

/**
 * Formatea teléfono (estilo argentino)
 * @param {string} value - Teléfono
 * @returns {string}
 */
function formatPhone(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return digits;
}

/**
 * Formatea CPA (Código Postal Argentino, A0000AAA) o CEP (backward compat)
 * @param {string} value
 * @returns {string}
 */
function formatCep(value) { return formatCpa(value); }
function formatCpa(value) {
    if (!value) return '';
    const digits = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (/^\d{8}$/.test(digits)) return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
    if (digits.length > 4) return digits.slice(0,4) + digits.slice(4);
    return digits;
}

/**
 * Formatea patente de vehículo (Mercosul / Argentina)
 * @param {string} value
 * @returns {string}
 */
function formatPlaca(value) {
    if (!value) return '';
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 7) return cleaned.replace(/([A-Z]{3})([0-9]{4})/, '$1-$2');
    return cleaned.replace(/([A-Z]{3})([0-9][A-Z][0-9]{2})/, '$1$2');
}

/**
 * Formatea valor monetario
 * @param {number|string} value - Valor
 * @param {string} currency - Moneda (default 'ARS')
 * @returns {string} Valor formateado
 */
function formatCurrency(value, currency = 'ARS') {
    if (value === null || value === undefined || value === '') return '$ 0,00';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) : value;
    if (isNaN(numValue)) return '$ 0,00';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(numValue);
}

/**
 * Formatea fecha para exibición (formato argentino ES-AR)
 * @param {Date|string} date
 * @param {boolean} includeTime
 * @returns {string}
 */
function formatDate(date, includeTime = false) {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (includeTime) { options.hour = '2-digit'; options.minute = '2-digit'; }
    return dateObj.toLocaleDateString('es-AR', options);
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

// ===== VALIDACIONES Y UTILIDADES =====

/**
 * Genera ID único
 * @returns {string}
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Genera número secuencial para OS (Órdenes de Servicio)
 * @returns {string}
 */
function generateOSNumber() {
    const year = new Date().getFullYear();
    const stored = localStorage.getItem('lastOSNumber') || '0';
    const nextNumber = (parseInt(stored) + 1).toString().padStart(6, '0');
    localStorage.setItem('lastOSNumber', nextNumber);
    return `OS${year}${nextNumber}`;
}

/**
 * Remueve acentos y caracteres especiales
 * @param {string} str
 * @returns {string}
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
 * Busca en array de objetos
 * @param {Array} array
 * @param {string} searchTerm
 * @param {Array} fields
 * @returns {Array}
 */
function searchInArray(array, searchTerm, fields) {
    if (!searchTerm || !array?.length) return array;
    const normalizedTerm = normalizeString(searchTerm);
    return array.filter(item => fields.some(field => {
        const value = getNestedValue(item, field);
        return normalizeString(String(value || '')).includes(normalizedTerm);
    }));
}

/**
 * Obtiene valor anidado de objeto
 * @param {Object} obj
 * @param {string} path
 * @returns {*}
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Debounce para optimizar búsquedas
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== MANIPULACIÓN DE DOM =====

/**
 * Agrega event listeners con cleanup automático
 * @param {Element} element
 * @param {string} event
 * @param {Function} handler
 */
function addEventListenerWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    if (!element._eventHandlers) element._eventHandlers = [];
    element._eventHandlers.push({ event, handler });
}

/**
 * Remueve todos los event listeners de un elemento
 * @param {Element} element
 */
function removeAllEventListeners(element) {
    if (element._eventHandlers) {
        element._eventHandlers.forEach(({ event, handler }) => element.removeEventListener(event, handler));
        element._eventHandlers = [];
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Crea elemento DOM con atributos
 * @param {string} tag
 * @param {Object} attributes
 * @param {string} content
 * @returns {Element}
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') { element.className = value; }
        else if (key === 'data') { Object.entries(value).forEach(([k, v]) => element.dataset[k] = v); }
        else { element.setAttribute(key, value); }
    });
    if (content) element.innerHTML = content;
    return element;
}

// ===== NOTIFICACIONES Y FEEDBACK =====

/**
 * Muestra notificación toast
 * @param {string} message
 * @param {string} type success|error|warning|info
 * @param {number} duration
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
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Crea container de notificaciones
 * @returns {Element}
 */
function createNotificationContainer() {
    const container = createElement('div', { id: 'notificationsContainer', class: 'notifications-container' });
    document.body.appendChild(container);
    return container;
}

/**
 * Retorna ícono para tipo de toast
 * @param {string} type
 * @returns {string}
 */
function getToastIcon(type) {
    const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
    return icons[type] || 'info-circle';
}

/**
 * Muestra loading overlay
 * @param {string} message
 */
function showLoading(message = 'Cargando...') {
    const existingLoading = document.getElementById('loadingOverlay');
    if (existingLoading) return;
    const overlay = createElement('div', { id: 'loadingOverlay', class: 'loading-overlay active' }, `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${escapeHtml(message)}</p>
        </div>
    `);
    document.body.appendChild(overlay);
}

/**
 * Remueve loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('loading-hide');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ===== EXPORTACIÓN E IMPORTACIÓN =====

/**
 * Exporta datos a JSON
 * @param {Object} data
 * @param {string} filename
 */
function exportToJSON(data, filename = 'backup-taller.json') {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = createElement('a', {
            href: url,
            download: `${filename}-${formatDate(new Date()).replace(/\//g, '-')}.json`
        });
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Datos exportados con éxito!', 'success');
    } catch (error) {
        console.error('Error al exportar:', error);
        showToast('Error al exportar datos', 'error');
    }
}

/**
 * Importa datos de archivo JSON
 * @param {Function} callback
 */
function importFromJSON(callback) {
    const input = createElement('input', { type: 'file', accept: '.json', style: 'display: none' });
    input.onchange = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                callback(data);
                showToast('Datos importados con éxito!', 'success');
            } catch (error) {
                console.error('Error al importar:', error);
                showToast('Error al leer archivo. Verifique que sea un JSON válido.', 'error');
            }
        };
        reader.readAsText(file);
    };
    document.body.appendChild(input); input.click(); document.body.removeChild(input);
}

// ===== CÁLCULOS Y ESTADÍSTICAS =====

/**
 * Calcula estadísticas básicas de array numérico
 * @param {Array} numbers
 * @returns {Object}
 */
function calculateStats(numbers) {
    if (!numbers?.length) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
    const validNumbers = numbers.filter(n => !isNaN(n) && n !== null && n !== undefined);
    if (!validNumbers.length) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
    const sum = validNumbers.reduce((acc, n) => acc + Number(n), 0);
    const avg = sum / validNumbers.length;
    return {
        sum,
        avg: Math.round(avg * 100) / 100,
        min: Math.min(...validNumbers),
        max: Math.max(...validNumbers),
        count: validNumbers.length
    };
}

/**
 * Agrupa array por propiedad
 * @param {Array} array
 * @param {string} key
 * @returns {Object}
 */
function groupBy(array, key) {
    if (!array?.length) return {};
    return array.reduce((groups, item) => {
        const group = getNestedValue(item, key) || 'No definido';
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

/**
 * Filtra datos por período
 * @param {Array} data
 * @param {string} dateField
 * @param {string} period hoy|semana|mes|ano (backward compat)
 * @returns {Array}
 */
function filterByPeriod(data, dateField, period) {
    if (!data?.length) return [];
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate, endDate;
    switch (period) {
        case 'hoje':
        case 'hoy':
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

// ===== UTILITARIOS DE RENDIMIENTO =====

/**
 * Throttle para optimizar eventos frecuentes
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
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
 * Memoización simple para cache de funciones
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// ===== EXPORTACIONES GLOBALES =====
window.OficinaHelpers = {
    // Formato
    formatCpfCnpj, formatDniCuit, formatDNI, formatCUIT,
    formatPhone, formatCep, formatCpa,
    formatPlaca, formatCurrency, formatDate, formatDateForInput,
    
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

console.log('✅ Helpers.js cargado con éxito');