# Projeto: Site simples para e-commerce redirecionado.

## Descrição
Este projeto é uma aplicação voltada para pessoas leigas que desejam criar seu próprio site de forma simples e intuitiva. O sistema permite que o usuário crie novas páginas, cadastre produtos, adicione imagens, textos, links de venda e tags para indexação. A interface será personalizável em aspectos básicos, como banners, cores, e estrutura inicial.

### Funcionalidades principais:
- Cadastro de produtos com:
  - Título
  - Imagem
  - Link de venda
  - Descrição
  - Tags para indexação
- Personalização de páginas iniciais com banners e cores.
- Pesquisa eficiente utilizando busca local (via Fuse.js).
- Sistema de autenticação para controle de usuários administrativos.
- Upload de imagens para as paginas.

---

## Tecnologias Utilizadas
- **React**: Framework para construção da interface do usuário.
- **TypeScript**: Para tipagem estática e melhor manutenção do código.
- **Node.js (v22)**: Para build e scripts auxiliares.
- **Firebase**:
  - **Firestore**: Armazenamento de dados.
  - **Firebase Hosting**: Publicação do site.
  - **Firebase Authentication**: Gerenciamento de usuários administrativos.
  - **Firebase Storage**: Para upload e armazenamento de imagens.
- **Fuse.js**: Para implementar o sistema de busca local eficiente.

---

## Instalação e Configuração

### Pré-requisitos
- Node.js (v22 ou superior)
- npm ou yarn instalado
- Conta configurada no Firebase

### Passos para rodar o projeto
1. Clone o repositório:
2. Instale as dependências:
   ```bash
    npm install
    # ou
    yarn install
   ```
3. Configure as variáveis de ambiente:
    - Crie um arquivo `firebaseConfig.json` na raiz do projeto e adicione suas configurações segundo o exemplo `firebaseConfig.example.json`
4. Execute o projeto em ambiente de desenvolvimento:
   ```bash
    npm start
    # ou
    yarn start
   ```

## Build e Publicação

### Gerar build para produção

Para exportar o site, use o seguinte comando:
```bash
npm run build
# ou
yarn build
```

Isso criará uma pasta build/ com os arquivos estáticos prontos para serem publicados.

### Publicação no Firebase Hosting
1. Instale o Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```
2. Faça login no Firebase:
    ```bash
    firebase login
    ```
3. Inicialize Config local do Firebase:
    ```bash
    firebase init hosting
    ```
    - Escolha o projeto do Firebase configurado.
    - Defina a pasta build/ como diretório público.
4. Publique o site:
    ```bash
    firebase deploy
    ```

### Notas Adicionais

- O sistema foi projetado para bases pequenas e médias, com busca local eficiente utilizando Fuse.js.
- Toda a autenticação será gerenciada pelo Firebase Authentication, e apenas usuários autorizados poderão realizar modificações no Firestore.
- As imagens enviadas serão armazenadas no Firebase Storage, com regras de segurança configuradas para restringir o acesso a usuários autenticados.

## Contribuição

Sinta-se à vontade para enviar PRs e sugestões para melhorias! Este projeto está em fase inicial e a colaboração é muito bem-vinda.