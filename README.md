# API de E-commerce

API RESTful desenvolvida em TypeScript com Express.js para gerenciamento de usuários, endereços e produtos.

## Tecnologias Utilizadas

- TypeScript
- Express.js
- MySQL2
- Redis
- JWT (JSON Web Token)
- Bcrypt
- Nodemailer

## Estrutura do Projeto

```
api-ecommerce-ts/
├── config/
│   ├── database.ts    # Configuração do MySQL
│   └── redisConfig.ts # Configuração do Redis
├── controllers/       # Controladores da aplicação
│   ├── authController.ts
│   ├── userController.ts
│   ├── categoriaController.ts
│   └── produtoController.ts
├── middlewares/      # Middlewares da aplicação
│   ├── validateAuth.ts
│   └── isAdmin.ts
├── models/          # Modelos de dados
│   ├── usuarioModel.ts
│   ├── enderecoModel.ts
│   ├── categoriaModel.ts
│   └── produtoModel.ts
├── routes/          # Rotas da API
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── categoriaRoutes.ts
│   └── produtoRoutes.ts
├── services/        # Lógica de negócios
│   ├── authService.ts
│   ├── userService.ts
│   └── categoriaService.ts
├── lib/            # Utilitários
│   ├── sendMail.ts
│   └── gerarCodigo.ts
└── sql/            # Scripts SQL
    └── categorias.sql
```

## Rotas da API

### Autenticação (`/api/v1/auth`)

#### Cadastro de Usuário
- **POST** `/register`
- **Descrição**: Cadastra um novo usuário no sistema
- **Body**:
```json
{
    "username": "string",
    "email": "string",
    "telefone": "string",
    "senha": "string",
    "confirmacaoSenha": "string"
}
```

#### Login
- **POST** `/login`
- **Descrição**: Autentica o usuário e retorna um token JWT
- **Body**:
```json
{
    "email": "string",
    "senha": "string"
}
```

#### Recuperação de Senha
- **POST** `/recovery`
- **Descrição**: Envia código de verificação para o email
- **Body**:
```json
{
    "email": "string",
    "tipo": "senha"
}
```

#### Redefinir Senha
- **POST** `/reset`
- **Descrição**: Redefine a senha usando código de verificação
- **Body**:
```json
{
    "email": "string",
    "codigo": "string",
    "novoDado": "string",
    "tipo": "senha"
}
```

### Usuário (`/api/v1/user`)
> Todas as rotas requerem autenticação via token JWT

#### Dados do Usuário
- **GET** `/me`
- **Descrição**: Retorna os dados do usuário autenticado

#### Atualizar Nome
- **PUT** `/me/name`
- **Descrição**: Atualiza o nome do usuário
- **Body**:
```json
{
    "username": "string"
}
```

#### Atualizar Senha
- **PUT** `/me/password`
- **Descrição**: Atualiza a senha do usuário
- **Body**:
```json
{
    "senha": "string",
    "confirmacaoSenha": "string"
}
```

#### Solicitar Alteração de Email
- **POST** `/change-email/request`
- **Descrição**: Envia código de verificação para o novo email
- **Body**:
```json
{
    "novoEmail": "string"
}
```

#### Confirmar Alteração de Email
- **POST** `/change-email/confirm`
- **Descrição**: Confirma a alteração do email usando código
- **Body**:
```json
{
    "novoEmail": "string",
    "codigo": "string"
}
```

### Endereços (`/api/v1/user`)
> Todas as rotas requerem autenticação via token JWT

#### Listar Endereços
- **GET** `/endereco`
- **Descrição**: Lista todos os endereços do usuário

#### Buscar Endereço
- **GET** `/endereco/:id`
- **Descrição**: Retorna um endereço específico do usuário

#### Criar Endereço
- **POST** `/endereco`
- **Descrição**: Cadastra um novo endereço
- **Body**:
```json
{
    "rua": "string",
    "numero": "number",
    "bairro": "string",
    "estado": "string",
    "pais": "string"
}
```

#### Atualizar Endereço
- **PUT** `/endereco/:id`
- **Descrição**: Atualiza um endereço existente
- **Body**: (mesmos campos do POST)

#### Deletar Endereço
- **DELETE** `/endereco/:id`
- **Descrição**: Remove um endereço

### Categorias (`/api/v1/categorias`)

#### Listar Categorias
- **GET** `/`
- **Descrição**: Lista todas as categorias

#### Buscar Categoria
- **GET** `/:id`
- **Descrição**: Retorna uma categoria específica

#### Criar Categoria
- **POST** `/`
- **Descrição**: Cria uma nova categoria (apenas admin)
- **Body**:
```json
{
    "nome": "string",
    "descricao": "string",
}
```

#### Atualizar Categoria
- **PUT** `/:id`
- **Descrição**: Atualiza uma categoria existente (apenas admin)
- **Body**: (mesmos campos do POST)

#### Deletar Categoria
- **DELETE** `/:id`
- **Descrição**: Remove uma categoria (apenas admin)

## Respostas Padrão

Todas as rotas retornam respostas no seguinte formato:

### Sucesso
```json
{
    "success": true,
    "message": "Mensagem de sucesso",
    "data": {} // opcional, dados específicos da rota
}
```

### Erro
```json
{
    "success": false,
    "message": "Mensagem de erro"
}
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro de usuário com validações
- ✅ Login com JWT
- ✅ Recuperação de senha via email
- ✅ Alteração de email com verificação

### Usuários
- ✅ Gerenciamento de perfil
- ✅ Atualização de dados pessoais
- ✅ Alteração de senha
- ✅ Verificação de email

### Endereços
- ✅ CRUD completo de endereços
- ✅ Validação de propriedade
- ✅ Múltiplos endereços por usuário

### Categorias
- ✅ CRUD completo de categorias
- ✅ Suporte a subcategorias
- ✅ Proteção de rotas admin
- ✅ Validações de dados

### Produtos
- ✅ CRUD básico de produtos
- ✅ Relacionamento com categorias
- ✅ Proteção de rotas admin

## Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação via JWT
- ✅ Proteção contra SQL Injection
- ✅ Rate limiting
- ✅ Validações de dados
- ✅ Códigos de verificação com expiração
- ✅ Cache com Redis
- ✅ Middleware de autenticação
- ✅ Middleware de verificação de admin

## Boas Práticas

- ✅ Arquitetura em camadas (MVC)
- ✅ Separação de responsabilidades
- ✅ Tipagem forte com TypeScript
- ✅ Tratamento de erros padronizado
- ✅ Queries SQL centralizadas
- ✅ Documentação clara
- ✅ Código limpo e organizado
- ✅ Respostas padronizadas

## Como Usar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```env
JWT_SECRET=sua_chave_secreta
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco
REDIS_URL=redis://localhost:6379
```

4. Execute os scripts SQL:
```bash
mysql -u seu_usuario -p nome_do_banco < sql/categorias.sql
```

5. Inicie o servidor:
```bash
npm run dev
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.