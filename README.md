# Broadcast

Desafio técnico SendFlow / Unnichat. Disparo (fake) de mensagens em massa com agendamento.

Demo: https://sendflow-broadcast-b5a16.web.app

Stack: React + TS + Vite, MUI, Tailwind v4, Firebase (Auth, Firestore, Functions), React Hook Form + Zod, Vitest. CI no GitHub Actions (type-check, testes, build).

## Rodar

```bash
cd web
npm install
cp .env.example .env   # config do Firebase
npm run dev
```

## Testes

```bash
cd web && npm test
```

## Deploy

```bash
cd web && npm run build
cd .. && firebase deploy
```

Function agendada exige plano Blaze.

## Estrutura

- `web/` — frontend
- `functions/` — Cloud Function que roda a cada 1min e marca mensagens agendadas como enviadas
- `firestore.rules` — isolamento por `userId`
