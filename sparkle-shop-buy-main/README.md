Sobre o projeto

Este projeto tem como objetivo simular um sistema de autenticação segura para operações sensíveis, como login e compras online, utilizando um mecanismo de iToken (código temporário) enviado por e-mail.

A aplicação permite que usuários visualizem suas compras e identifiquem possíveis transações não reconhecidas em cartão de crédito, adicionando uma camada extra de segurança semelhante a sistemas bancários.

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Objetivo

Desenvolver uma aplicação que:

* Realize autenticação de usuários
* Utilize validação de token (iToken)
* Envie códigos de verificação por e-mail
* Proteja operações sensíveis (ex: compras online)
* Permita identificar e contestar compras não reconhecidas

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🔐 Como funciona a segurança (iToken)

O sistema utiliza autenticação em duas etapas (2FA):

1. Usuário faz login com e-mail e senha
2. O sistema gera um iToken (código temporário)
3. O código é enviado por e-mail
4. O usuário precisa inserir o código para validar o acesso ou concluir uma compra

🔒 Sem o token, a operação não é finalizada, mesmo com senha correta.

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

💳 Fluxo da aplicação

🧑‍💻 Login seguro

* Entrada de credenciais
* Geração de iToken
* Envio por e-mail
* Validação do código

🛒 Compra online

* Usuário inicia uma compra
* Sistema identifica ação sensível
* Geração de novo iToken
* Validação do código
* Aprovação ou cancelamento da compra

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

⚙️ Funcionalidades

* ✅ Cadastro de usuários
* ✅ Login com autenticação em duas etapas (2FA)
* ✅ Geração e validação de iToken
* ✅ Envio de token por e-mail
* ✅ Listagem de compras
* ✅ Marcação de compra como “não reconhecida”
* ✅ Integração com API de CEP (ViaCEP)
* 🔄 Integração com API do Gmail

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🛠️ Tecnologias utilizadas

* Front-end: TypeScript
* Back-end: Java (em desenvolvimento)
* APIs externas:
    * ViaCEP
    * Gmail

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Estrutura do projeto

/src
  /components
  /pages
  /services
  /assets

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Como executar o projeto

# Clone o repositório
git clone https://github.com/mvcorreia/A3-Valida-o-de-token-.git

# Acesse a pasta
cd A3-Valida-o-de-token-

# Instale as dependências
npm install

# Execute o projeto
npm run dev

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Regras de segurança implementadas

* Token obrigatório para ações sensíveis
* Validação de identidade via e-mail
* Possibilidade de expiração do token (tempo limitado)
* Proteção de rotas com autenticação

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Possíveis melhorias futuras

* Implementação completa do back-end em Java
* Criptografia segura dos tokens
* Expiração e renovação automática de tokens
* Autenticação via SMS (opcional)
* Sistema de detecção de fraudes
* Dashboard administrativo

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Autor

Desenvolvido por Marcus Vinicius Correia

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Observação

Este projeto foi desenvolvido para fins acadêmicos, com o objetivo de demonstrar conceitos de autenticação segura e proteção contra fraudes em compras online.

