/**
 * Utilitarios de Formato
 * Funciones para formateo de datos como fechas, monedas, DNI/CUIT, etc.
 */

/**
 * Formatea un valor a moneda Argentina
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda ARS
 */
function formatCurrencyARS(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        currencyDisplay: 'symbol'
    }).format(value);
}
/** @deprecated Usar formatCurrencyARS. Moneda Argentina (compatibilidad) */
function formatCurrency(value) { return formatCurrencyARS(value); }

/**
 * Formatea una fecha para el formato Argentino
 * @param {Date|string} date - Fecha
 * @returns {string} Fecha formateada DD/MM/AAAA
 */
function formatDate(date) {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-AR');
}

/**
 * Formatea DNI / CUIL argentino
 * @param {string} dni - DNI o CUIL
 * @returns {string}
 */
function formatDNI(dni) {
    if (!dni) return '';
    const clean = dni.replace(/\D/g, '');
    if (clean.length <= 8) return clean.replace(/(\d{2})(\d{3})(\d{0,3})/, (m, a, b, c) => `${a}.${b}${c ? '.' + c : ''}`);
    if (clean.length === 11) return clean.slice(0,2) + '-' + clean.slice(2,10) + '-' + clean.slice(10);
    return clean;
}
/** @deprecated usar formatDNI */
function formatCPF(cpf) { return formatDNI(cpf); }

/**
 * Formatea CUIT / CUIL (alias CUIT)
 * @param {string} cuit
 * @returns {string}
 */
function formatCUIT(cuit) { return formatDNI(cuit); }
/** @deprecated usar formatCUIT */
function formatCNPJ(cnpj) { return formatCUIT(cnpj); }

/**
 * Formatea CPA (Código Postal Argentino)
 * @param {string} cpa
 * @returns {string}
 */
function formatCPA(cpa) {
    if (!cpa) return '';
    const clean = cpa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (clean.length > 4) return clean.slice(0,4) + clean.slice(4);
    return clean;
}

/**
 * Formatea teléfono (formato argentino)
 * @param {string} phone
 * @returns {string}
 */
function formatPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 11) {
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (clean.length === 10) {
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return clean;
}

export {
    formatCurrencyARS as formatCurrency,
    formatDate,
    formatDNI,
    formatCUIT,
    formatCPA,
    formatCPF,
    formatCNPJ,
    formatPhone
};
