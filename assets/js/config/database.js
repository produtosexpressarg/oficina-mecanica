/**
 * Configuração do banco de dados
 * Gerencia conexões e operações com o banco de dados local
 */

const DB_CONFIG = {
    name: 'oficina_mecanica_db',
    version: 1,
    stores: {
        clientes: { keyPath: 'id', autoIncrement: true },
        veiculos: { keyPath: 'id', autoIncrement: true },
        servicos: { keyPath: 'id', autoIncrement: true },
        produtos: { keyPath: 'id', autoIncrement: true },
        vendas: { keyPath: 'id', autoIncrement: true },
        notasFiscais: { keyPath: 'id', autoIncrement: true }
    }
};

/**
 * Inicializa o banco de dados
 * @returns {Promise} Promise com a conexão do banco de dados
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
        
        request.onerror = (event) => {
            console.error('Erro ao abrir banco de dados:', event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log('Banco de dados inicializado com sucesso');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Criar stores se não existirem
            Object.entries(DB_CONFIG.stores).forEach(([storeName, storeConfig]) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, storeConfig);
                    console.log(`Store ${storeName} criada`);
                }
            });
        };
    });
}

/**
 * Obtém uma conexão com o banco de dados
 * @returns {Promise} Promise com a conexão do banco de dados
 */
async function getDatabase() {
    return await initDatabase();
}

export { DB_CONFIG, initDatabase, getDatabase };