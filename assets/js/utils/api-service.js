/**
 * Serviço de API
 * Funções para comunicação com o backend
 */

import { apiRequest } from '../config/api.js';

/**
 * Serviço para gerenciar clientes
 */
const ClienteService = {
    getAll: () => apiRequest('clientes'),
    getById: (id) => apiRequest(`clientes/${id}`),
    create: (data) => apiRequest('clientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`clientes/${id}`, { method: 'DELETE' })
};

/**
 * Serviço para gerenciar veículos
 */
const VeiculoService = {
    getAll: () => apiRequest('veiculos'),
    getById: (id) => apiRequest(`veiculos/${id}`),
    getByCliente: (clienteId) => apiRequest(`clientes/${clienteId}/veiculos`),
    create: (data) => apiRequest('veiculos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`veiculos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`veiculos/${id}`, { method: 'DELETE' })
};

/**
 * Serviço para gerenciar serviços
 */
const ServicoService = {
    getAll: () => apiRequest('servicos'),
    getById: (id) => apiRequest(`servicos/${id}`),
    create: (data) => apiRequest('servicos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`servicos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`servicos/${id}`, { method: 'DELETE' })
};

/**
 * Serviço para gerenciar produtos
 */
const ProdutoService = {
    getAll: () => apiRequest('produtos'),
    getById: (id) => apiRequest(`produtos/${id}`),
    create: (data) => apiRequest('produtos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`produtos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`produtos/${id}`, { method: 'DELETE' })
};

/**
 * Serviço para gerenciar vendas
 */
const VendaService = {
    getAll: () => apiRequest('vendas'),
    getById: (id) => apiRequest(`vendas/${id}`),
    create: (data) => apiRequest('vendas', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`vendas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`vendas/${id}`, { method: 'DELETE' })
};

/**
 * Serviço para gerenciar notas fiscais
 */
const NotaFiscalService = {
    getAll: () => apiRequest('notas-fiscais'),
    getById: (id) => apiRequest(`notas-fiscais/${id}`),
    create: (data) => apiRequest('notas-fiscais', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`notas-fiscais/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`notas-fiscais/${id}`, { method: 'DELETE' })
};

export {
    ClienteService,
    VeiculoService,
    ServicoService,
    ProdutoService,
    VendaService,
    NotaFiscalService
};