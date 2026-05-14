# Broadcast

Desafio técnico SendFlow / Unnichat. SaaS para gerenciar conexões, contatos e disparo (fake) de mensagens com agendamento.

Stack: React + TypeScript + Vite, Firebase (Auth, Firestore, Functions), MUI e Tailwind.

## Estrutura

- `web/` — frontend
- `functions/` — Cloud Functions
- `firestore.rules`, `firestore.indexes.json`, `firebase.json`

## Coleções (sem subcoleções)

- `connections` — `{ userId, name, createdAt }`
- `contacts` — `{ userId, connectionId, name, phone, createdAt }`
- `messages` — `{ userId, connectionId, contactIds[], content, status, scheduledFor, sentAt, createdAt }`

Isolamento por cliente via `userId` no documento e nas regras.

## Rodar localmente

```bash
cd web && npm install
cd ../functions && npm install
```

Copie `web/.env.example` para `web/.env` e preencha com a config do seu projeto Firebase.

```bash
cd web && npm run dev
```

## Deploy

```bash
cd web && npm run build
cd .. && firebase deploy
```

Precisa do plano Blaze para a function agendada.

## Agendamento

`dispatchScheduledMessages` roda a cada minuto, busca `status == 'scheduled'` com `scheduledFor <= now` e atualiza para `sent`.
