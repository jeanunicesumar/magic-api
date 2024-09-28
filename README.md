
# Magic API - NestJS

## Descrição

Esta API foi desenvolvida utilizando [NestJS](https://nestjs.com/) para fornecer informações sobre os cards e decks do jogo Magic: The Gathering. A API permite a visualização e gestão de cards, decks e usuários, com funcionalidades como geração de decks, autenticação de usuários, validação de arquivos JSON, e listagem de decks de usuários.

### Criadores

- Cássia Yumi
- Jean Soares

## Pré-requisitos

Certifique-se de ter os seguintes itens instalados e configurados:

- Node.js (v14 ou superior)
- Docker (Redis)

### Dependências

A API utiliza Redis para caching. Você precisará de um contêiner Redis em execução na porta padrão (6379).

Para subir um contêiner Redis, execute o comando:

```bash
docker run -d -p 6379:6379 redis
```

## Rotas
### Endpoints de Decks

#### `/decks/generate` 

**Método:** `GET`  
**Autenticação:** Requer token JWT  
**Descrição:** Gera um novo deck para o usuário autenticado.  
**Exemplo de uso:**

```bash
GET /decks/generate
```

#### `/decks/generate/json` 

**Método:** `GET`  
**Descrição:** Gera um arquivo JSON contendo um deck e o envia como download.  
**Exemplo de uso:**

```bash
GET /decks/generate/json
```

#### `/decks/list-user-decks`

**Método:** `GET`  
**Autenticação:** Requer token JWT  
**Descrição:** Lista todos os decks pertencentes ao usuário autenticado.  
**Exemplo de uso:**

```bash
GET /decks/list-user-decks
```

#### `/decks/populate/cards` 

**Método:** `POST`  
**Descrição:** Popula os cards da API de [MAGIC]("http://api.magicthegathering.io/v1/cards") no banco de dados.

```bash
POST /decks/populate/cards
```

#### `/decks/validate/json`

**Método:** `POST`  
**Descrição:** Valida um arquivo JSON carregado contendo um deck de Magic.  
**Exemplo de uso:**

```bash
POST /decks/validate/json
```

#### `/decks`

**Método:** `POST`  
**Autenticação:** Requer token JWT  
**Descrição:** Cria um novo deck para o usuário autenticado.  
**Exemplo de uso:**

```bash
POST /decks
```

#### `/decks`

**Método:** `GET`  
**Autenticação:** Requer token JWT e a role `ADMIN`  
**Descrição:** Lista todos os decks, com paginação.  
**Exemplo de uso:**

```bash
GET /decks?page=1
```

#### `/decks/:id`

**Método:** `GET`  
**Descrição:** Retorna as informações de um deck específico.  
**Exemplo de uso:**

```bash
GET /decks/:id
```

#### `/decks/:id`

**Método:** `PATCH`  
**Descrição:** Atualiza os dados de um deck específico.  
**Exemplo de uso:**

```bash
PATCH /decks/:id
```

#### `/decks/:id`

**Método:** `DELETE`  
**Descrição:** Remove um deck específico.  
**Exemplo de uso:**

```bash
DELETE /decks/:id
```

### Endpoints de Usuários

#### `/users`

**Método:** `GET`  
**Autenticação:** Requer token JWT e a role `ADMIN`  
**Descrição:** Lista todos os usuários cadastrados.  
**Exemplo de uso:**

```bash
GET /users
```

#### `/users/:id`

**Método:** `GET`  
**Autenticação:** Requer token JWT  
**Descrição:** Retorna as informações de um usuário específico.  
**Exemplo de uso:**

```bash
GET /users/:id
```

#### `/users`

**Método:** `POST`  
**Descrição:** Cria um novo usuário.  
**Exemplo de uso:**

```bash
POST /users
```

#### `/users/:id`

**Método:** `PATCH`  
**Descrição:** Atualiza as informações de um usuário específico.  
**Exemplo de uso:**

```bash
PATCH /users/:id
```

#### `/users/:id`

**Método:** `DELETE`  
**Descrição:** Remove um usuário específico.  
**Exemplo de uso:**

```bash
DELETE /users/:id
```

#### `/users/auth`

**Método:** `POST`  
**Descrição:** Autentica um usuário e retorna um token JWT.  
**Exemplo de uso:**

```bash
POST /users/auth
```

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/jeanunicesumar/magic-api.git
   cd magic-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (exemplo no arquivo `.env`):
   ```bash
   API_URL=""
   DATABASE=""
   SECRET_KEY=""
   EXPIRES_IN=""
   SALT_ROUNDS=
   ```

4. Execute o projeto:
   ```bash
   npm run start
   ```

## Contribuições

Sinta-se à vontade para contribuir com este projeto. Para sugestões ou melhorias, abra uma issue ou envie um pull request.
