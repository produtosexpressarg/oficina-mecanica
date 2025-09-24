/**
 * Configuração da API
 * Contém as configurações para requisições à API
 */

const API_CONFIG = {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Função para criar uma URL completa da API
 * @param {string} endpoint - O endpoint da API
 * @returns {string} URL completa
 */
function getApiUrl(endpoint) {
    return `${API_CONFIG.baseUrl}/${endpoint}`;
}

/**
 * Função para fazer requisições à API
 * @param {string} endpoint - O endpoint da API
 * @param {Object} options - Opções da requisição
 * @returns {Promise} Promise com a resposta
 */
async function apiRequest(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    const requestOptions = {
        ...options,
        headers: {
            ...API_CONFIG.headers,
            ...options.headers
        },
        timeout: options.timeout || API_CONFIG.timeout
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

export { API_CONFIG, getApiUrl, apiRequest };