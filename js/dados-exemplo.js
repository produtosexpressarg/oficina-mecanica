/**
 * Script para criar dados de exemplo para teste
 */

function criarDadosExemplo() {
    // Verificar se já existem dados
    const clientesExistentes = localStorage.getItem('oficina_clientes');
    
    if (!clientesExistentes || JSON.parse(clientesExistentes).length === 0) {
        // Criar clientes de exemplo
        const clientesExemplo = [
            {
                id: 1,
                nome: "João Silva",
                tipo: "pessoa_fisica",
                cpf: "123.456.789-00",
                telefone: "(11) 99999-1234",
                email: "joao@email.com",
                endereco: "Rua das Flores, 123",
                bairro: "Centro",
                cidade: "São Paulo",
                estado: "SP",
                cep: "01234-567",
                status: "ativo",
                data_cadastro: new Date().toISOString(),
                observacoes: "Cliente preferencial"
            },
            {
                id: 2,
                nome: "Maria Santos",
                tipo: "pessoa_fisica",
                cpf: "987.654.321-00",
                telefone: "(11) 88888-5678",
                email: "maria@email.com",
                endereco: "Av. Principal, 456",
                bairro: "Jardim",
                cidade: "São Paulo",
                estado: "SP",
                cep: "04567-890",
                status: "ativo",
                data_cadastro: new Date().toISOString(),
                observacoes: ""
            },
            {
                id: 3,
                nome: "Empresa ABC Ltda",
                tipo: "pessoa_juridica",
                cnpj: "12.345.678/0001-90",
                telefone: "(11) 77777-9012",
                email: "contato@empresaabc.com",
                endereco: "Rua Comercial, 789",
                bairro: "Industrial",
                cidade: "São Paulo",
                estado: "SP",
                cep: "08901-234",
                status: "ativo",
                data_cadastro: new Date().toISOString(),
                observacoes: "Empresa parceira"
            }
        ];

        localStorage.setItem('oficina_clientes', JSON.stringify(clientesExemplo));
        console.log('Dados de exemplo criados:', clientesExemplo);
    } else {
        console.log('Dados já existem no localStorage');
    }
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    criarDadosExemplo();
});