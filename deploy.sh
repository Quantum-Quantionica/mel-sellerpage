#!/bin/bash

# Cores ANSI
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

# Inicia o build em background e oculta o output
(((yarn install && yarn build) > /dev/null 2>&1) &)
BUILD_PID=$!

# Verifica se o ID do projeto foi passado como argumento
if [ -n "$1" ]; then
  PROJECT_ID="$1"
  echo -e "${CYAN}Usando o projeto Firebase: $PROJECT_ID${NC}"
else
  # Solicita ao usuário para selecionar o projeto do Firebase
  firebase projects:list
  echo -e "${CYAN}Digite o ID do projeto Firebase que deseja usar para o deploy:${NC}"
  read PROJECT_ID
fi

# Define o projeto selecionado
echo -e "${YELLOW}Selecionando o projeto...${NC}"
firebase use $PROJECT_ID --add

echo -e "${YELLOW}Aguardando o término do build...${NC}"
wait $BUILD_PID
echo -e "${GREEN}Build concluído!${NC}"

# Executa o deploy apenas do hosting
echo -e "${CYAN}Iniciando o deploy do hosting...${NC}"
firebase deploy --only hosting --project $PROJECT_ID
