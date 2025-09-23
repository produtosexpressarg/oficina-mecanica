# Sistema de Gestão - Oficina Mecânica

## Estrutura do Projeto

```
oficina-mecanica/
├── README.md
├── package.json
├── .gitignore
├── index.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── modules/
│   │   │   ├── clientes.js
│   │   │   ├── veiculos.js
│   │   │   ├── servicos.js
│   │   │   ├── estoque.js
│   │   │   ├── notas-fiscais.js
│   │   │   ├── vendas.js
│   │   │   └── dashboard.js
│   │   ├── utils/
│   │   │   ├── storage.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   └── config/
│   │       └── constants.js
│   ├── images/
│   │   ├── logo.png
│   │   ├── icons/
│   │   │   ├── cliente.svg
│   │   │   ├── veiculo.svg
│   │   │   ├── servico.svg
│   │   │   └── estoque.svg
│   │   └── backgrounds/
│   └── fonts/
├── components/
│   ├── header.html
│   ├── navigation.html
│   ├── modals/
│   │   ├── cliente-modal.html
│   │   ├── veiculo-modal.html
│   │   ├── servico-modal.html
│   │   └── produto-modal.html
│   └── tables/
│       ├── clientes-table.html
│       ├── veiculos-table.html
│       ├── servicos-table.html
│       └── produtos-table.html
├── pages/
│   ├── dashboard.html
│   ├── clientes.html
│   ├── veiculos.html
│   ├── servicos.html
│   ├── estoque.html
│   ├── notas-fiscais.html
│   └── vendas.html
├── data/
│   ├── mock-data.json
│   └── schemas/
│       ├── cliente-schema.json
│       ├── veiculo-schema.json
│       ├── servico-schema.json
│       └── produto-schema.json
├── docs/
│   ├── manual-usuario.md
│   ├── api-documentation.md
│   └── deployment-guide.md
└── tests/
    ├── unit/
    │   ├── clientes.test.js
    │   ├── veiculos.test.js
    │   └── servicos.test.js
    └── integration/
        └── workflow.test.js
```

## Descrição dos Arquivos e Pastas

### Raiz do Projeto
- **README.md**: Documentação principal do projeto
- **package.json**: Configurações do projeto e dependências
- **.gitignore**: Arquivos e pastas ignorados pelo Git
- **index.html**: Página principal da aplicação

### /assets/
Contém todos os recursos estáticos da aplicação.

#### /assets/css/
- **styles.css**: Estilos principais da aplicação
- **components.css**: Estilos específicos dos componentes
- **responsive.css**: Estilos para responsividade

#### /assets/js/
- **app.js**: Arquivo principal JavaScript que inicializa a aplicação

##### /assets/js/modules/
Módulos específicos para cada funcionalidade:
- **clientes.js**: Gerenciamento de clientes
- **veiculos.js**: Gerenciamento de veículos
- **servicos.js**: Ordens de serviço
- **estoque.js**: Controle de estoque
- **notas-fiscais.js**: Gerenciamento de notas fiscais
- **vendas.js**: Sistema de vendas e pagamentos
- **dashboard.js**: Funcionalidades do dashboard

##### /assets/js/utils/
Utilitários e funções auxiliares:
- **storage.js**: Gerenciamento do localStorage/sessionStorage
- **helpers.js**: Funções auxiliares gerais
- **validators.js**: Validações de formulários e dados

##### /assets/js/config/
- **constants.js**: Constantes da aplicação

#### /assets/images/
Recursos visuais da aplicação:
- **logo.png**: Logo da oficina
- **/icons/**: Ícones SVG para diferentes seções
- **/backgrounds/**: Imagens de fundo

#### /assets/fonts/
Fontes customizadas (se necessário)

### /components/
Componentes HTML reutilizáveis:
- **header.html**: Cabeçalho da aplicação
- **navigation.html**: Menu de navegação
- **/modals/**: Modais para diferentes funcionalidades
- **/tables/**: Templates de tabelas

### /pages/
Páginas individuais da aplicação (caso opte por SPA com roteamento)

### /data/
- **mock-data.json**: Dados de exemplo para desenvolvimento
- **/schemas/**: Esquemas JSON para validação de dados

### /docs/
Documentação do projeto:
- **manual-usuario.md**: Manual do usuário
- **api-documentation.md**: Documentação da API (se houver backend)
- **deployment-guide.md**: Guia de deployment

### /tests/
Testes automatizados:
- **/unit/**: Testes unitários
- **/integration/**: Testes de integração

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização com Flexbox/Grid
- **JavaScript ES6+**: Lógica da aplicação
- **LocalStorage**: Persistência de dados no cliente

### Bibliotecas e Frameworks
- **Chart.js**: Gráficos e relatórios
- **Font Awesome**: Ícones
- **SweetAlert2**: Alertas personalizados
- **Date-fns**: Manipulação de datas

### Ferramentas de Desenvolvimento
- **ESLint**: Linting do JavaScript
- **Prettier**: Formatação de código
- **Live Server**: Servidor de desenvolvimento

## Funcionalidades

### 1. Dashboard
- Visão geral dos dados
- Gráficos e estatísticas
- Serviços em andamento
- Resumo financeiro

### 2. Gestão de Clientes
- Cadastro completo de clientes
- Edição e exclusão
- Busca e filtros
- Histórico de serviços

### 3. Gestão de Veículos
- Cadastro de veículos por cliente
- Informações técnicas
- Histórico de manutenções
- Controle de quilometragem

### 4. Ordens de Serviço
- Criação de OS com numeração automática
- Controle de status
- Cálculo de valores
- Relatórios de serviços

### 5. Controle de Estoque
- Cadastro de produtos e peças
- Controle de entrada e saída
- Alertas de estoque mínimo
- Relatórios de movimentação

### 6. Notas Fiscais
- Emissão de NF de entrada e saída
- Integração com estoque
- Controle fiscal
- Relatórios tributários

### 7. Vendas e Pagamentos
- Registro de vendas
- Múltiplas formas de pagamento
- Controle de recebimentos
- Relatórios financeiros

## Instalação e Execução

### Pré-requisitos
- Navegador web moderno
- Editor de código (VS Code recomendado)
- Live Server ou servidor local

### Passos para Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/oficina-mecanica.git
cd oficina-mecanica
```

2. **Instale as dependências (se usar npm):**
```bash
npm install
```

3. **Execute o projeto:**
```bash
# Com Live Server (VS Code)
# Clique com botão direito no index.html > "Open with Live Server"

# Ou com Python (se instalado)
python -m http.server 8000

# Ou com Node.js
npx live-server
```

4. **Acesse no navegador:**
```
http://localhost:8000
```

## Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use ESLint para manter consistência
- Comente código complexo
- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis e funções

## Roadmap

### Versão 1.0 (MVP)
- [x] Sistema básico de cadastros
- [x] Ordens de serviço
- [x] Controle de estoque
- [x] Interface responsiva

### Versão 1.1
- [ ] Relatórios avançados
- [ ] Backup automático
- [ ] Integração com WhatsApp
- [ ] Sistema de lembretes

### Versão 2.0
- [ ] Backend com Node.js
- [ ] Banco de dados
- [ ] API REST
- [ ] Sistema multiusuário

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@oficinamecanica.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: www.oficinamecanica.com

## Autores

- **Seu Nome** - *Desenvolvimento inicial* - [@SeuUsuario](https://github.com/SeuUsuario)

## Agradecimentos

- Comunidade JavaScript
- Desenvolvedores que contribuíram
- Oficinas mecânicas que forneceram feedback