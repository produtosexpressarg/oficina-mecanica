// Dados de exemplo para o módulo de Embarques
(function(){
    const key = 'comex_embarques';
    const dados = localStorage.getItem(key);
    if (!dados || JSON.parse(dados).length === 0) {
        const exemplos = [
            {
                id: Date.now()-2,
                tipo: 'importacao',
                modo: 'maritimo',
                incoterm: 'FOB',
                numeroDocumento: 'MSCU1234567',
                cliente: 'Indústria Alpha',
                fornecedor: 'Shanghai Exports Co.',
                origem: 'Shanghai/China',
                destino: 'Santos/Brasil',
                eta: new Date(Date.now()+1000*60*60*24*15).toISOString().split('T')[0],
                status: 'em_transito',
                observacoes: 'Container 40HC; Peso bruto 22t',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            },
            {
                id: Date.now()-1,
                tipo: 'exportacao',
                modo: 'aereo',
                incoterm: 'CIF',
                numeroDocumento: 'AWB 871-98765432',
                cliente: 'Distribuidora Beta',
                fornecedor: 'Oficina Mecânica (Exportadora)',
                origem: 'São Paulo/Brasil',
                destino: 'Miami/EUA',
                eta: new Date(Date.now()+1000*60*60*24*7).toISOString().split('T')[0],
                status: 'planejado',
                observacoes: 'Carga perecível, prioridade urgente',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            }
        ];
        localStorage.setItem(key, JSON.stringify(exemplos));
        console.log('[comex] Dados de exemplo criados', exemplos);
    }
})();

// Dados de exemplo para o módulo de Pedidos
(function(){
    const key = 'comex_pedidos';
    const dados = localStorage.getItem(key);
    if (!dados || JSON.parse(dados).length === 0) {
        const exemplos = [
            {
                id: Date.now()-5,
                numero: 'PO-2025-001',
                tipo: 'compra',
                incoterm: 'FOB',
                cliente: 'Oficina Mecânica',
                fornecedor: 'Shanghai Exports Co.',
                moeda: 'USD',
                valor: 15400.50,
                data: new Date(Date.now()-1000*60*60*24*10).toISOString().split('T')[0],
                status: 'em_aberto',
                observacoes: '15 itens - peças automotivas',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            },
            {
                id: Date.now()-4,
                numero: 'SO-2025-002',
                tipo: 'venda',
                incoterm: 'CIF',
                cliente: 'Distribuidora Beta',
                fornecedor: 'Oficina Mecânica (Exportadora)',
                moeda: 'USD',
                valor: 7850,
                data: new Date(Date.now()-1000*60*60*24*3).toISOString().split('T')[0],
                status: 'aprovado',
                observacoes: 'Venda internacional - linha premium',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            },
            {
                id: Date.now()-3,
                numero: 'PO-2025-003',
                tipo: 'compra',
                incoterm: 'EXW',
                cliente: 'Oficina Mecânica',
                fornecedor: 'EuroTech GmbH',
                moeda: 'EUR',
                valor: 1299.00,
                data: new Date(Date.now()+1000*60*60*24*5).toISOString().split('T')[0],
                status: 'faturado',
                observacoes: 'Ferramentas especiais para manutenção',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            }
        ];
        localStorage.setItem(key, JSON.stringify(exemplos));
        console.log('[comex] Pedidos de exemplo criados', exemplos);
    }
})();