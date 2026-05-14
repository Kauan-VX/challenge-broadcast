# Broadcast

SaaS multi-tenant para envio e agendamento (fake) de mensagens em massa. Cada cliente tem suas próprias conexões, e cada conexão isola seus contatos e mensagens.

Desafio técnico SendFlow / Unnichat.

## Stack

- **Frontend** — React 18 + TypeScript, Vite, Material UI v6, Tailwind CSS v4 (integrado via `@layer mui` para coexistir com o emotion do MUI sem hacks), React Router, React Hook Form + Zod.
- **Backend** — Firebase Auth, Firestore (real-time via `onSnapshot`), Cloud Functions v2 (`onSchedule`).
- **Testes** — Vitest + Testing Library + jsdom.

## Estrutura

```
.
├── functions/               # Cloud Functions (Node 20)
│   └── src/index.ts         # dispatchScheduledMessages (a cada 1 min)
├── web/                     # Frontend
│   └── src/
│       ├── components/      # Componentes reutilizáveis
│       ├── contexts/        # AuthContext, ToastContext
│       ├── hooks/           # useAuth, useConnection, useDisclosure, useToast, etc.
│       ├── lib/             # firebase.ts, phone.ts
│       ├── pages/           # Login, Signup, Connections, Contacts, Messages, SendMessage
│       ├── schemas/         # Schemas Zod e mensagens centralizadas
│       └── services/        # CRUD do Firestore (connections, contacts, messages)
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── .firebaserc
```

## Modelo de dados

Coleções planas no nível raiz, sem subcoleções (requisito do desafio). O relacionamento é por `userId` e `connectionId`.

| Coleção       | Campos                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `connections` | `userId`, `name`, `createdAt`                                                                                |
| `contacts`    | `userId`, `connectionId`, `name`, `phone`, `createdAt`                                                       |
| `messages`    | `userId`, `connectionId`, `contactIds[]`, `content`, `status`, `scheduledFor`, `sentAt`, `createdAt`         |

**Por que uma mensagem é um documento único com `contactIds[]` e não N documentos?** Para envio em massa, um único documento representa a intenção do disparo, simplifica edição/exclusão antes do envio e mantém a quantidade de writes baixa. O custo é que o tamanho do array é limitado pelo cap de 1 MiB por documento do Firestore — suficiente para o caso de uso.

## Isolamento entre clientes

[`firestore.rules`](firestore.rules) — todas as operações exigem que `request.auth.uid` seja igual ao `userId` do documento. Um usuário não consegue ler, criar, atualizar ou deletar nada que não pertença a ele, mesmo conhecendo o ID do documento.

## Tempo real

Todos os listeners da UI usam `onSnapshot` ([`useConnections`](web/src/hooks/useConnections.ts), [`useContacts`](web/src/hooks/useContacts.ts), [`useMessages`](web/src/hooks/useMessages.ts), [`useConnection`](web/src/hooks/useConnection.ts)). Mudanças feitas em outra aba/dispositivo aparecem imediatamente.

## Disparo agendado

[`functions/src/index.ts`](functions/src/index.ts) define `dispatchScheduledMessages`, rodando a cada minuto via Cloud Scheduler. Busca mensagens com `status == 'scheduled'` e `scheduledFor <= now`, e atualiza `status` para `sent` em batch.

**Limitação conhecida:** a function é at-least-once. Em retry, em teoria um mesmo documento pode ser processado duas vezes. Para "envio fake" o efeito é apenas atualizar campos idempotentes (`status` e `sentAt`), então não é um problema na prática. Em produção real, eu envolveria a leitura + atualização em uma `runTransaction` para garantir a transição `scheduled → sent` exatamente uma vez.

## Validação

Toda entrada do usuário passa por schemas Zod ([`web/src/schemas/`](web/src/schemas/)) com mensagens de erro centralizadas em [`schema-message.ts`](web/src/schemas/schema-message.ts). Os formulários consomem os schemas via `react-hook-form` + `@hookform/resolvers/zod`.

## Rodar localmente

```bash
cd web
npm install
cp .env.example .env   # preencha com a config do seu projeto Firebase
npm run dev            # http://localhost:5173
```

Para iterar nas Functions:

```bash
cd functions
npm install
npm run build:watch
```

## Testes

```bash
cd web
npm test              # uma execução
npm run test:watch    # modo watch
```

Cobertura atual: schemas Zod (telefone, mensagem, contato), `lib/phone`, hook `useDisclosure`.

## Deploy

```bash
cd web && npm run build
cd .. && firebase deploy
```

A function `dispatchScheduledMessages` exige projeto no plano **Blaze** (Cloud Functions v2 não roda no Spark).

Subcomandos úteis:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## CI

Workflow em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — em cada push ou PR para `main` roda `tsc --noEmit`, `vitest run` e `vite build` no diretório `web/`.

## Decisões e trade-offs

- **Tailwind v4 + MUI v6 sem `!important`.** Integração feita pelo caminho oficial do MUI (`StyledEngineProvider enableCssLayer` + `@layer theme, base, mui, components, utilities`), o que faz utilitários Tailwind vencerem o emotion do MUI por ordem de camada, sem hack de especificidade.
- **Sem subcoleções.** Imposto pelo desafio; favorece queries cross-coleção e simplifica deleção em cascata via `writeBatch` no [`deleteConnection`](web/src/services/connections.ts).
- **Validações de shape no Firestore Rules ficaram fora de escopo.** As regras atuais garantem ownership (`isOwner(userId)`) mas não restringem campos extras nem tipos. Em produção, eu adicionaria `hasOnly([...])` e checagens de tipo/tamanho.
- **Sem paginação nos listeners.** Para um SaaS real com clientes grandes, `useMessages`/`useContacts` precisariam de `limit()` + paginação por cursor. Mantive simples por escopo, mas a refatoração é localizada no hook.
- **`onSchedule('every 1 minutes')`.** Granularidade de 1 minuto é suficiente para o desafio. Para precisão de segundos, eu usaria Cloud Tasks com agendamento por mensagem.
