# Gerenciador de Clientes

Este projeto é um sistema de gerenciamento de clientes, feito para organizar informações de contato e criar rotas de atendimento.

## Tecnologias Utilizadas

- **Frontend:** React.js com Next.js (versão 12.x)
- **Backend:** API Routes do Next.js
- **Banco de Dados:** PostgreSQL (versão 14.x)

## Instalação e Configuração Local

As instruções abaixo são para usuários com conhecimento em Node.js e PostgreSQL.

### Pré-requisitos:

- Node.js versão 14.x ou superior (utilizado v20.11.0)
- npm versão 6.x ou superior (utilizado v10.4.0)
- PostgreSQL versão 14.x (utilizado v16.2)

### Passos para Execução:

1. Clone o repositório em sua máquina local usando:
   ```bash
   git clone <url-do-repositorio>


2. Entre no diretório do projeto
   ```bash
   cd <nome-da-pasta-do-projeto>

3. Instale as dependências do projeto
   ```bash
   npm install

2. Execute o script SQL para criar a tabela de clientes no PostgreSQL, antes, verifique a configuração do arquivo `db.js`. Para o DDL você pode usar:
   ```bash
    CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    coordenada_x INTEGER,
    coordenada_y INTEGER
    );

2. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev

2. Acesse http://localhost:3000 em seu navegador para visualizar a aplicação.

