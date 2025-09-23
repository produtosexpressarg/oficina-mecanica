/**
 * Gerenciador de Armazenamento Local
 * Sistema de Gestão - Oficina Mecânica
 */

class StorageManager {
    constructor() {
        this.prefix = STORAGE_CONFIG.PREFIX || 'oficina_';
        this.version = STORAGE_CONFIG.VERSION || '1.0';
        this.cache = new Map();
        this.cacheTimeout = CACHE_CONFIG.TTL || 5 * 60 * 1000; // 5 minutos
        
        // Verificar suporte ao localStorage
        this.isSupported = this.checkSupport();
        
        // Migrar dados se necessário
        this.migrateData();
    }
    
    /**
     * Verificar se localStorage é suportado
     */
    checkSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ localStorage não suportado:', e.message);
            return false;
        }
    }
    
    /**
     * Migrar dados de versões anteriores
     */
    migrateData() {
        try {
            const currentVersion = localStorage.getItem(`${this.prefix}version`);
            
            if (!currentVersion || currentVersion !== this.version) {
                console.log('🔄 Migrando dados para versão', this.version);
                
                // Aqui você pode implementar lógica de migração
                // Por exemplo, renomear chaves, converter formatos, etc.
                
                localStorage.setItem(`${this.prefix}version`, this.version);
                console.log('✅ Migração concluída');
            }
        } catch (error) {
            console.error('❌ Erro na migração de dados:', error);
        }
    }
    
    /**
     * Gerar chave com prefixo
     */
    getKey(key) {
        return `${this.prefix}${key}`;
    }
    
    /**
     * Salvar dados no localStorage
     */
    set(key, data, options = {}) {
        if (!this.isSupported) {
            console.warn('⚠️ localStorage não suportado');
            return false;
        }
        
        try {
            const storageKey = this.getKey(key);
            const timestamp = Date.now();
            
            const item = {
                data: data,
                timestamp: timestamp,
                version: this.version,
                compressed: options.compress || false,
                encrypted: options.encrypt || false,
                ttl: options.ttl || null
            };
            
            // Comprimir se solicitado
            if (options.compress) {
                item.data = this.compress(data);
            }
            
            // Criptografar se solicitado
            if (options.encrypt) {
                item.data = this.encrypt(item.data);
            }
            
            const serialized = JSON.stringify(item);
            localStorage.setItem(storageKey, serialized);
            
            // Atualizar cache
            this.cache.set(key, {
                data: data,
                timestamp: timestamp,
                expires: options.cacheTTL ? timestamp + options.cacheTTL : null
            });
            
            // Emitir evento
            this.emitEvent('storage:set', { key, data });
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            return false;
        }
    }
    
    /**
     * Recuperar dados do localStorage
     */
    get(key, defaultValue = null, options = {}) {
        if (!this.isSupported) {
            return defaultValue;
        }
        
        try {
            // Verificar cache primeiro
            if (options.useCache !== false && this.cache.has(key)) {
                const cached = this.cache.get(key);
                const now = Date.now();
                
                if (!cached.expires || cached.expires > now) {
                    return cached.data;
                } else {
                    this.cache.delete(key);
                }
            }
            
            const storageKey = this.getKey(key);
            const serialized = localStorage.getItem(storageKey);
            
            if (serialized === null) {
                return defaultValue;
            }
            
            const item = JSON.parse(serialized);
            
            // Verificar TTL
            if (item.ttl && Date.now() > item.timestamp + item.ttl) {
                this.remove(key);
                return defaultValue;
            }
            
            let data = item.data;
            
            // Descriptografar se necessário
            if (item.encrypted) {
                data = this.decrypt(data);
            }
            
            // Descomprimir se necessário
            if (item.compressed) {
                data = this.decompress(data);
            }
            
            // Atualizar cache
            this.cache.set(key, {
                data: data,
                timestamp: Date.now(),
                expires: options.cacheTTL ? Date.now() + options.cacheTTL : null
            });
            
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao recuperar do localStorage:', error);
            return defaultValue;
        }
    }
    
    /**
     * Verificar se existe uma chave
     */
    has(key) {
        if (!this.isSupported) {
            return false;
        }
        
        const storageKey = this.getKey(key);
        return localStorage.getItem(storageKey) !== null;
    }
    
    /**
     * Remover item do localStorage
     */
    remove(key) {
        if (!this.isSupported) {
            return false;
        }
        
        try {
            const storageKey = this.getKey(key);
            localStorage.removeItem(storageKey);
            
            // Remover do cache
            this.cache.delete(key);
            
            // Emitir evento
            this.emitEvent('storage:remove', { key });
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao remover do localStorage:', error);
            return false;
        }
    }
    
    /**
     * Limpar todos os dados da aplicação
     */
    clear() {
        if (!this.isSupported) {
            return false;
        }
        
        try {
            const keys = Object.keys(localStorage);
            const appKeys = keys.filter(key => key.startsWith(this.prefix));
            
            appKeys.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Limpar cache
            this.cache.clear();
            
            // Emitir evento
            this.emitEvent('storage:clear');
            
            console.log('🗑️ Dados da aplicação limpos');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
            return false;
        }
    }
    
    /**
     * Obter todas as chaves da aplicação
     */
    keys() {
        if (!this.isSupported) {
            return [];
        }
        
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }
    
    /**
     * Obter tamanho do localStorage usado pela aplicação
     */
    size() {
        if (!this.isSupported) {
            return 0;
        }
        
        try {
            let totalSize = 0;
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    const value = localStorage.getItem(key);
                    totalSize += key.length + (value ? value.length : 0);
                }
            });
            
            return totalSize;
        } catch (error) {
            console.error('❌ Erro ao calcular tamanho:', error);
            return 0;
        }
    }
    
    /**
     * Exportar todos os dados da aplicação
     */
    export() {
        if (!this.isSupported) {
            return null;
        }
        
        try {
            const data = {};
            const keys = this.keys();
            
            keys.forEach(key => {
                data[key] = this.get(key);
            });
            
            return {
                version: this.version,
                timestamp: new Date().toISOString(),
                data: data
            };
            
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            return null;
        }
    }
    
    /**
     * Importar dados
     */
    import(exportData, options = {}) {
        if (!this.isSupported || !exportData) {
            return false;
        }
        
        try {
            // Validar estrutura
            if (!exportData.data || typeof exportData.data !== 'object') {
                throw new Error('Formato de dados inválido');
            }
            
            // Backup atual se solicitado
            if (options.backup) {
                const backup = this.export();
                this.set('import_backup', backup);
            }
            
            // Limpar dados existentes se solicitado
            if (options.clearExisting) {
                this.clear();
            }
            
            // Importar dados
            Object.entries(exportData.data).forEach(([key, value]) => {
                this.set(key, value);
            });
            
            console.log('📥 Dados importados com sucesso');
            this.emitEvent('storage:import', { data: exportData });
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao importar dados:', error);
            return false;
        }
    }
    
    /**
     * Comprimir dados (simulado - implementar com biblioteca real se necessário)
     */
    compress(data) {
        // Por enquanto só converte para string
        // Em produção, usar biblioteca como pako.js
        return JSON.stringify(data);
    }
    
    /**
     * Descomprimir dados
     */
    decompress(data) {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }
    
    /**
     * Criptografar dados (simulado - implementar criptografia real se necessário)
     */
    encrypt(data) {
        // Por enquanto só converte para base64
        // Em produção, usar biblioteca de criptografia real
        return btoa(JSON.stringify(data));
    }
    
    /**
     * Descriptografar dados
     */
    decrypt(data) {
        try {
            return JSON.parse(atob(data));
        } catch {
            return data;
        }
    }
    
    /**
     * Limpar cache expirado
     */
    cleanExpiredCache() {
        const now = Date.now();
        
        for (const [key, value] of this.cache.entries()) {
            if (value.expires && value.expires < now) {
                this.cache.delete(key);
            }
        }
    }
    
    /**
     * Otimizar localStorage removendo dados antigos ou desnecessários
     */
    optimize() {
        try {
            // Remover itens com TTL expirado
            const keys = this.keys();
            
            keys.forEach(key => {
                const item = this.getRawItem(key);
                if (item && item.ttl && Date.now() > item.timestamp + item.ttl) {
                    this.remove(key);
                }
            });
            
            // Limpar cache
            this.cleanExpiredCache();
            
            console.log('🔧 localStorage otimizado');
            
        } catch (error) {
            console.error('❌ Erro na otimização:', error);
        }
    }
    
    /**
     * Obter item raw (com metadados)
     */
    getRawItem(key) {
        try {
            const storageKey = this.getKey(key);
            const serialized = localStorage.getItem(storageKey);
            return serialized ? JSON.parse(serialized) : null;
        } catch {
            return null;
        }
    }
    
    /**
     * Verificar integridade dos dados
     */
    checkIntegrity() {
        const issues = [];
        const keys = this.keys();
        
        keys.forEach(key => {
            try {
                const item = this.getRawItem(key);
                if (!item) {
                    issues.push({ key, issue: 'Item não encontrado' });
                    return;
                }
                
                if (!item.version) {
                    issues.push({ key, issue: 'Versão não definida' });
                }
                
                if (!item.timestamp) {
                    issues.push({ key, issue: 'Timestamp não definido' });
                }
                
                // Tentar parsear os dados
                this.get(key);
                
            } catch (error) {
                issues.push({ key, issue: error.message });
            }
        });
        
        return issues;
    }
    
    /**
     * Reparar dados corrompidos
     */
    repair() {
        const issues = this.checkIntegrity();
        let repaired = 0;
        
        issues.forEach(issue => {
            try {
                if (issue.issue === 'Item não encontrado') {
                    this.remove(issue.key);
                    repaired++;
                } else {
                    // Tentar reparar item corrompido
                    const rawData = localStorage.getItem(this.getKey(issue.key));
                    if (rawData) {
                        // Tentar diferentes estratégias de reparo
                        const repairedData = this.attemptRepair(rawData);
                        if (repairedData) {
                            this.set(issue.key, repairedData);
                            repaired++;
                        } else {
                            // Se não conseguir reparar, remover
                            this.remove(issue.key);
                            repaired++;
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Erro ao reparar item:', issue.key, error);
            }
        });
        
        console.log(`🔧 ${repaired} itens reparados`);
        return repaired;
    }
    
    /**
     * Tentar reparar dados corrompidos
     */
    attemptRepair(rawData) {
        // Estratégia 1: Tentar parsear JSON direto
        try {
            return JSON.parse(rawData);
        } catch {}
        
        // Estratégia 2: Verificar se é um objeto válido sem wrapper
        try {
            const parsed = JSON.parse(rawData);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        } catch {}
        
        // Estratégia 3: Tentar remover caracteres inválidos
        try {
            const cleaned = rawData.replace(/[\x00-\x1F\x7F]/g, '');
            return JSON.parse(cleaned);
        } catch {}
        
        return null;
    }
    
    /**
     * Emitir evento customizado
     */
    emitEvent(eventName, detail = {}) {
        if (typeof CustomEvent !== 'undefined') {
            const event = new CustomEvent(eventName, { detail });
            document.dispatchEvent(event);
        }
    }
    
    /**
     * Estatísticas do armazenamento
     */
    getStats() {
        return {
            supported: this.isSupported,
            version: this.version,
            totalKeys: this.keys().length,
            totalSize: this.formatBytes(this.size()),
            cacheSize: this.cache.size,
            lastOptimized: this.get('last_optimized', 'Nunca')
        };
    }
    
    /**
     * Formatar bytes em formato legível
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Criar instância singleton
const storageManager = new StorageManager();

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = storageManager;
} else {
    window.StorageManager = storageManager;
}

// Auto-otimização periódica
setInterval(() => {
    storageManager.optimize();
}, 60 * 60 * 1000); // A cada hora

console.log('💾 Gerenciador de armazenamento inicializado');