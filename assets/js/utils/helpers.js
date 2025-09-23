/**
 * Funções Auxiliares
 * Sistema de Gestão - Oficina Mecânica
 */

/**
 * Gerar ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formatar data para exibição
 */
function formatDate(date, format = 'dd/MM/yyyy') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    const formats = {
        'dd/MM/yyyy': `${day}/${month}/${year}`,
        'MM/dd/yyyy': `${month}/${day}/${year}`,
        'yyyy-MM-dd': `${year}-${month}-${day}`,
        'dd/MM/yyyy HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
        'dd/MM/yyyy HH:mm:ss': `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
        'HH:mm': `${hours}:${minutes}`,
        'HH:mm:ss': `${hours}:${minutes}:${seconds}`
    };
    
    return formats[format] || formats['dd/MM/yyyy'];
}

/**
 * Formatar valor monetário
 */
function formatCurrency(value, currency = 'BRL', locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value));
}

/**
 * Formatar número
 */
function formatNumber(value, decimals = 0, locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) return '0';
    
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(Number(value));
}

/**
 * Formatar telefone brasileiro
 */
function formatPhone(phone) {
    if (!phone) return '';
    
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length === 10) {
        return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 4)}-${numbers.substr(6, 4)}`;
    } else if (numbers.length === 11) {
        return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 5)}-${numbers.substr(7, 4)}`;
    }
    
    return phone;
}

/**
 * Formatar CPF
 */
function formatCPF(cpf) {
    if (!cpf) return '';
    
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length === 11) {
        return `${numbers.substr(0, 3)}.${numbers.substr(3, 3)}.${numbers.substr(6, 3)}-${numbers.substr(9, 2)}`;
    }
    
    return cpf;
}

/**
 * Formatar CNPJ
 */
function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length === 14) {
        return `${numbers.substr(0, 2)}.${numbers.substr(2, 3)}.${numbers.substr(5, 3)}/${numbers.substr(8, 4)}-${numbers.substr(12, 2)}`;
    }
    
    return cnpj;
}

/**
 * Formatar CEP
 */
function formatCEP(cep) {
    if (!cep) return '';
    
    const numbers = cep.replace(/\D/g, '');
    
    if (numbers.length === 8) {
        return `${numbers.substr(0, 5)}-${numbers.substr(5, 3)}`;
    }
    
    return cep;
}

/**
 * Formatar placa de veículo
 */
function formatPlate(plate) {
    if (!plate) return '';
    
    const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Formato antigo (AAA-9999)
    if (cleaned.length === 7 && /^[A-Z]{3}\d{4}$/.test(cleaned)) {
        return `${cleaned.substr(0, 3)}-${cleaned.substr(3, 4)}`;
    }
    
    // Formato Mercosul (AAA9A99)
    if (cleaned.length === 7 && /^[A-Z]{3}\d[A-Z]\d{2}$/.test(cleaned)) {
        return `${cleaned.substr(0, 3)}${cleaned.substr(3, 1)}${cleaned.substr(4, 1)}${cleaned.substr(5, 2)}`;
    }
    
    return plate.toUpperCase();
}

/**
 * Validar CPF
 */
function validateCPF(cpf) {
    if (!cpf) return false;
    
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return false;
    if (/^(\d)\1+$/.test(numbers)) return false; // Todos os dígitos iguais
    
    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;
    
    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;
    
    return true;
}

/**
 * Validar CNPJ
 */
function validateCNPJ(cnpj) {
    if (!cnpj) return false;
    
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) return false;
    if (/^(\d)\1+$/.test(numbers)) return false; // Todos os dígitos iguais
    
    // Validar primeiro dígito verificador
    let size = numbers.length - 2;
    let digits = numbers.substring(0, size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(digits.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(numbers.charAt(size))) return false;
    
    // Validar segundo dígito verificador
    size = size + 1;
    digits = numbers.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(digits.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === parseInt(numbers.charAt(size));
}

/**
 * Validar email
 */
function validateEmail(email) {
    if (!email) return false;
    return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Validar placa de veículo
 */
function validatePlate(plate) {
    if (!plate) return false;
    const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    return /^[A-Z]{3}\d{4}$/.test(cleaned) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(cleaned);
}

/**
 * Calcular idade
 */
function calculateAge(birthDate) {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Calcular diferença entre datas em dias
 */
function daysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verificar se data está no passado
 */
function isPastDate(date) {
    if (!date) return false;
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate < today;
}

/**
 * Obter primeiro e último dia do mês
 */
function getMonthRange(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay, lastDay };
}

/**
 * Debounce - atrasar execução de função
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle - limitar execução de função
 */
function throttle(func, limit) {
    let in