# ReCircula

Aplicativo mobile para conectar pessoas a pontos de descarte, coleta e recompensas por reciclagem de eletrônicos.

O ReCircula ajuda usuários a dar um destino correto a resíduos eletrônicos, encontrar ecopontos parceiros, agendar coletas e acumular ecopontos que podem ser trocados por benefícios.

## Funcionalidades

- Cadastro e login com Firebase Authentication.
- Perfil do usuário com endereço, saldo de pontos e histórico de impacto.
- Listagem de pontos de coleta parceiros.
- Detalhes do ecoponto com endereço, horários, itens aceitos e geração de código de entrega.
- Fluxo de agendamento de coleta com seleção de categoria, itens, data e período.
- Sistema de ecopontos com saldo em tempo real via Firestore.
- Tela de recompensas com resgate por pontos.
- Interface adaptada para mobile e web com Expo Router.

## Tecnologias

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- React Native Calendars
- React Native Maps
- Expo Google Fonts

## Requisitos

Antes de começar, instale:

- Node.js
- npm
- Expo CLI ou use `npx expo`
- Expo Go no celular, ou um emulador Android/iOS configurado

## Como Executar

Clone o repositório:

```bash
git clone <url-do-repositorio>
cd ReCircula
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm start
```

Depois, escolha onde abrir:

- Expo Go, escaneando o QR Code.
- Emulador Android.
- Simulador iOS.
- Navegador, usando o modo web.

## Scripts

```bash
npm start
```

Inicia o servidor de desenvolvimento do Expo.

```bash
npm run android
```

Executa o app no Android.

```bash
npm run ios
```

Executa o app no iOS.

```bash
npm run web
```

Executa o app na web.

```bash
npm run lint
```

Executa a análise de lint do projeto.

## Estrutura do Projeto

```text
ReCircula/
├── app/
│   ├── (tabs)/
│   │   ├── colect/        # Fluxo de seleção e agendamento de coleta
│   │   ├── map/           # Pontos de coleta e confirmação de entrega
│   │   ├── rewards/       # Recompensas e explicação dos pontos
│   │   ├── home.tsx       # Tela inicial autenticada
│   │   └── profile.tsx    # Perfil do usuário
│   ├── components/        # Componentes reutilizáveis
│   ├── utils/             # Funções auxiliares
│   ├── index.tsx          # Onboarding
│   ├── login.tsx          # Login
│   └── register.tsx       # Cadastro
├── hooks/                 # Hooks compartilhados
├── src/services/          # Integrações externas
│   └── firebase.ts        # Configuração do Firebase
├── constants/             # Constantes de tema
├── assets/                # Imagens, ícones e fontes
└── package.json
```

## Firebase

O app usa Firebase Authentication para autenticação e Cloud Firestore para armazenar dados de usuários, agendamentos, entregas e pontuação.

As principais coleções utilizadas são:

- `users`: dados do usuário, endereço e saldo de pontos.
- `schedules`: agendamentos, entregas em ecopontos, status e códigos de validação.

Para rodar com outro projeto Firebase, atualize as credenciais em:

```text
src/services/firebase.ts
```

## Fluxos Principais

1. O usuário cria uma conta ou faz login.
2. A partir da home, pode agendar uma coleta ou consultar pontos parceiros.
3. No agendamento, seleciona itens, data e período.
4. Em pontos de coleta, pode gerar um código de entrega.
5. Ao concluir ações válidas, acumula ecopontos.
6. Na área de recompensas, usa os pontos para resgatar benefícios.

## Status do Projeto

Projeto em desenvolvimento, com foco em prototipação de uma solução para logística reversa e descarte responsável de eletrônicos.
