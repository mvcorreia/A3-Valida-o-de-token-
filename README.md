## Sistema de Validação de iToken para Compras Online

Golpe escolhido entre os temas foi: Compra não reconhecida no cartão de credito

Sobre o projeto

Este projeto simula um sistema de segurança para validação de compras online, utilizando um mecanismo de iToken (código temporário) enviado por e-mail.

O objetivo é adicionar uma camada extra de proteção contra fraudes, permitindo que apenas o usuário autorizado finalize uma transação.

Além disso, a aplicação permite visualizar compras e identificar possíveis transações não reconhecidas em cartão de crédito.

---

## Contexto e relevância

De acordo com estudos recentes da Serasa Experian:

* **Mais de 50%** dos brasileiros foram vítimas de fraude em 2024.
* Cerca de **54,2%** das vítimas tiveram prejuízo financeiro.
* **20%** perderam entre R$ 1.000 e R$ 5.000.
* O uso indevido de cartões de crédito representa quase metade dos golpes (**~47,9%**).
* O público-alvo principal dos golpistas são pessoas entre 40 e 65 anos.

Esses dados demonstram a necessidade de mecanismos adicionais de segurança em transações online, como a validação por iToken proposta neste projeto.

## Fontes

* [UOL Notícias - Metade dos brasileiros sofreu fraude em 2024](https://noticias.uol.com.br/ultimas-noticias/agencia-brasil/2025/03/25/metade-dos-brasileiros-sofreu-fraude-em-2024-diz-serasa-experian.htm)
* [Rádio Itatiaia - Mais da metade dos brasileiros foi vítima de fraude](https://www.itatiaia.com.br/brasil/mais-da-metade-dos-brasileiros-foi-vitima-de-fraude-em-2024-20-deles-perderam-entre-1-e-5-mil-reais/)
---

## Objetivo

Desenvolver uma aplicação que:

* Realize autenticação básica de usuários
* Utilize validação de token (iToken) em compras
* Envie códigos de verificação por e-mail
* Proteja transações online

---
## Tecnologias e Arquitetura:
* **Front-end:** TypeScript & React
* **Back-end:** Java & Spring Boot (Data JPA, Spring Mail)
* **Banco de Dados:** PostgreSQL
* **Comunicação:** API REST (JSON)
* **APIs Externas:** ViaCEP (Consulta de endereço) • Gmail SMTP (Envio do iToken)

---
## API própria (Back-end) (em Desenvolvimento)

O projeto conta com uma API própria desenvolvida em Java, responsável por centralizar toda a lógica de persistência e segurança.

### Responsabilidades:
* Gerenciamento e cadastro de usuários
* Controle e histórico de compras
* Geração, armazenamento temporário e validação do iToken
* Integração nativa com serviço de e-mail

### Principais Endpoints:
* `POST /auth/register` - Registro de novos usuários
* `POST /auth/login` - Autenticação no sistema
* `GET /compras` - Listagem de transações do usuário
* `POST /payment/checkout` - Inicia a transação e dispara o iToken por e-mail
* `POST /payment/validate-token` - Valida o código digitado e finaliza a compra

---
## Estrutura do Projeto

### Front-end
```bash
/src
  /assets         # Imagens, ícones e arquivos estáticos
  /components    # Componentes reutilizáveis da interface
  /hooks         # Hooks personalizados (lógica reutilizável)
  /lib           # Funções auxiliares e utilitários
  /pages         # Páginas e telas da aplicação
  /store         # Gerenciamento de estado global
  /test          # Testes da aplicação
  App.tsx        # Componente principal
  main.tsx       # Ponto de entrada da aplicação
```
---
## Back-end (Estrutura de Camadas)

controller: Gerencia as rotas e requisições HTTP da API.

AuthController (Login/Registro) • PaymentController (Checkout e validação de token)

Service: Concentra toda a lógica de negócio e regras da aplicação.

AuthService (Fluxo de login) • PaymentService (Lógica do iToken) • EmailService (Disparos SMTP)

repository: Camada de persistência (comunicação direta com o banco de dados).

UserRepository (Queries estruturadas via Spring Data JPA)

model: Entidades que mapeiam as tabelas relacionais.

User (Mapeia a tabela users do PostgreSQL)

dto: Objetos para tráfego seguro de dados entre as pontas do sistema.

LoginDTO • RegisterDTO • PaymentRequestDTO • TokenValidationDTO

application.properties: Arquivo de configuração de credenciais da API.


---
## Arquitetura do sistema

* Front-end: TypeScript 
* Back-end: Java (em desenvolvimento)
* Comunicação: API REST
* Segurança: Validação de iToken por e-mail

---

## Como funciona a segurança (iToken)

O sistema aplica validação apenas em operações sensíveis, como compras:

1. Usuário realiza login
2. Ao iniciar uma compra, o sistema gera um iToken
3. O código é enviado por e-mail
4. O usuário insere o código para confirmar a compra

Sem o token, a compra não é finalizada

Características do token:

* Tempo de expiração (ex: 5 minutos)
* Uso único por transação

---

## Fluxo da aplicação

Usuário faz o registro no site → Login → Inicia compra → Vai para o carrinho → Coloca as informações de enredereço e cartão → Clica em Finaizar compra → Geração de iToken → Envio por e-mail → Validação → Compra aprovada ou cancelada

## Tela de Registro
<img width="1920" height="953" alt="Registro" src="https://github.com/user-attachments/assets/0d309a9b-4e3b-4ee6-b7a0-ce4acf0bfdbc" />

## Tela de Login
<img width="1920" height="953" alt="Login" src="https://github.com/user-attachments/assets/19dcaa15-3c62-43c5-970e-1140afe5a871" />

## Tela de Inicial
<img width="1920" height="952" alt="Pagina 1" src="https://github.com/user-attachments/assets/c4368203-207f-4b25-898e-1bd20076780b" />

## Tela de Produtos
<img width="748" height="811" alt="Produtos" src="https://github.com/user-attachments/assets/3a26244f-a953-45d8-8244-8d5c95db17c8" />

## Tela de Endereço
<img width="1920" height="948" alt="Pagamento 1" src="https://github.com/user-attachments/assets/94c13075-26a0-41bb-a86e-388c5eda68d1" />

## Tela de dados do cartão
<img width="1920" height="664" alt="Pagamento 2" src="https://github.com/user-attachments/assets/281b1ca1-2bfd-4dd1-a2ca-a24e52968e82" />

## Tela de Token
<img width="1920" height="935" alt="Token" src="https://github.com/user-attachments/assets/1eae9e2b-4cf2-44ae-b998-c78ce57e0288" />

## Tela do Token no Email
<img width="1920" height="935" alt="Token" src="https://github.com/mvcorreia/A3-Valida-o-de-token-/blob/e3224e43a69609acc201b85f7e17ceaece277d6c/src/assets/Token%20no%20email.jpeg" />

## Tela de Token no Banco de Dados
<img width="1920" height="935" alt="Token" src="https://github.com/mvcorreia/A3-Valida-o-de-token-/blob/1b175bd890db5ca24173ffad7ae2ca30880d6659/src/assets/Token%20e%20login%20no%20console.png" />

## Tela de Compra Realizada
<img width="1920" height="952" alt="Compra realizada" src="https://github.com/user-attachments/assets/1b00421c-60ff-4620-8e54-4321766936c7" />

## Tela de Compra Bloqueada (Após erro de 3 tentativas do Token)
<img width="1920" height="938" alt="Compra bloqueada" src="https://github.com/user-attachments/assets/6ca828e0-e0fe-4c13-b13c-b1a8eba9b3b4" />

## Tela do Banco de Dados
<img width="1920" height="938" alt="Compra bloqueada" src="https://github.com/mvcorreia/A3-Valida-o-de-token-/blob/b3bdb9436cc3777fcd225b96218b67e843d9a239/src/assets/BD.png" />

---

## Funcionalidades

* Cadastro de usuários
* Login básico
* Geração e validação de iToken
* Envio de token por e-mail
* Listagem de compras
* Marcação de compra como “não reconhecida”
* Integração com API de CEP (ViaCEP)
* Integração com envio de e-mail (Gmail)

---

## Tecnologias utilizadas

* Front-end: TypeScript 
* Back-end: Java (em desenvolvimento)
* APIs externas:
    * ViaCEP
    * Gmail SMTP

---

## Estrutura do projeto

```bash
/src
  /assets        # Imagens, ícones e arquivos estáticos
  /components    # Componentes reutilizáveis da interface
  /hooks         # Hooks personalizados (lógica reutilizável)
  /lib           # Funções auxiliares e utilitários
  /pages         # Páginas/telas da aplicação
  /store         # Gerenciamento de estado global
  /test          # Testes da aplicação

  App.tsx        # Componente principal
  main.tsx       # Ponto de entrada da aplicação
```
---

## Regras de segurança implementadas

* Token obrigatório para confirmação de compras
* Validação via e-mail
* Proteção de rotas
* Token com possibilidade de expiração
* Token único por transação

---

## Limitações do projeto

* Projeto acadêmico
* Back-end em desenvolvimento
* Integrações parcialmente simuladas

---

## Possíveis melhorias futuras

* Criptografia segura dos tokens
* Expiração automática e controle de tentativas
* Sistema de detecção de fraudes
* Subir projeto no render
* Reenviar o Token

---
## Como executar o projeto

## 1. Clonar o repositório
```bash
git clone https://github.com/mvcorreia/A3-Valida-o-de-token-.git
```
## 2. Acessar a pasta do projeto
```bash
cd A3-Valida-o-de-token-
```

## 3. Instalar as dependências
```bash
npm install
```
## 4. Executar o Projeto
```bash
npm run dev
```
---
## Autor

Desenvolvido por Marcus Vinicius Correia

---

## Observação

Este projeto foi desenvolvido com base em dados reais sobre fraudes no Brasil, com foco em segurança de transações online e prevenção de golpes financeiros.


https://trello.com/invite/b/6a03cfcf179298be994e431a/ATTI6feb1e8e7c9f230b499d8b960fb53bdaB21344F8/a3
