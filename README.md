# Broadcast

Aplicação SaaS para gerenciar conexões, contatos e disparo (fake) de mensagens com agendamento.

## Stack

- React + TypeScript + Vite
- Material UI + Tailwind CSS
- Firebase Auth, Firestore (realtime) e Cloud Functions
- Paradigma funcional

## Estrutura

```
.
├── web/          Frontend (Vite + React)
├── functions/    Cloud Functions (TypeScript)
├── firestore.rules
├── firestore.indexes.json
└── firebase.json
```

## Modelo de dados

Coleções flat (sem subcoleções):

- `connections` — `{ userId, name, createdAt }`
- `contacts` — `{ userId, connectionId, name, phone, createdAt }`
- `messages` — `{ userId, connectionId, contactIds[], content, status, scheduledFor, sentAt, createdAt }`

Isolamento por cliente é garantido por `userId` no documento e pelas regras do Firestore.

## Pré-requisitos

- Node 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Projeto Firebase com Authentication (email/senha), Firestore e Functions habilitados (plano Blaze para Functions agendadas)

## Configuração

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com/).
2. Ative **Authentication** com provedor **E-mail/senha**.
3. Crie um **Firestore Database** em modo produção.
4. Ajuste o `projectId` em `.firebaserc`.
5. Em `web/`, copie `.env.example` para `.env` e preencha com as credenciais do seu app web Firebase.

```bash
cd web
cp .env.example .env
```

## Instalação

```bash
cd web && npm install
cd ../functions && npm install
```

## Desenvolvimento

```bash
# em web/
npm run dev
```

## Build e Deploy

```bash
# build do frontend
cd web && npm run build

# deploy completo (hosting + functions + regras)
cd ..
firebase deploy
```

Para deploys parciais:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules,firestore:indexes
```

## Agendamento

A função `dispatchScheduledMessages` roda a cada minuto, lê mensagens com `status == 'scheduled'` e `scheduledFor <= now`, e marca como `sent` em batch.
# desafio-SendFlow-Unnichat
