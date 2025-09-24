/**
 * Utilitários de formatação
 * Funções para formatação de dados como datas, moedas, CPF, etc.
 */

/**
 * Formata um valor para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata uma data para o formato brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatDate(date) {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Formata um CPF (xxx.xxx.xxx-xx)
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado
 */
function formatCPF(cpf) {
    if (!cpf) return '';
    const cpfClean = cpf.replace(/\D/g, '');
    return cpfClean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ (xx.xxx.xxx/xxxx-xx)
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} CNPJ formatado
 */
function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    const cnpjClean = cnpj.replace(/\D/g, '');
    return cnpjClean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata um telefone ((xx) xxxxx-xxxx)
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
function formatPhone(phone) {
    if (!phone) return '';
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length === 11) {
        return phoneClean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phoneClean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export {
    formatCurrency,
    formatDate,
    formatCPF,
    formatCNPJ,
    formatPhone
};