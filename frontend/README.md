# Offline AI Workbench: Frontend (SIH26117)

Ye SIH26117 ka React frontend hai. Ek offline, air-gapped AI workbench jisme chat, company documents se jawab, file generation aur network monitor hai.

Abhi ye **prototype** hai: saare features kaam karte hain, design simple rakha gaya hai. Design baad me `src/index.css` aur components me badalna hai.

---

## 1. Kya kya bana hua hai

| Page | Route | Features |
|---|---|---|
| Chat | `/`, `/chat/:id` | Streaming jawab, stop, regenerate, copy, model badge, agent steps, sources, file card, file attach, Auto/Fast/Smart mode, knowledge base toggle, chat history (search, rename, delete), example prompts |
| Knowledge base | `/knowledge` | Drag & drop upload (multiple), progress bar, documents table, status (processing/ready/failed), auto-refresh, extracted text preview, delete, search + type filter |
| Generated files | `/files` | AI ki banayi files, download, delete, type filter, source chat ka link |
| System | `/system` | Outbound connections counter, air-gap status, connection graph, live connections list, models status, RAM/GPU usage, services health, audit log (date filter + CSV export) |
| Har page | – | Topbar me network badge, dark/light theme, Hindi/English toggle, toast messages, loading/empty/error states |

Authentication nahi hai (jaan boojh ke hataya gaya hai).

---

## 2. Tech stack

| Kaam | Library |
|---|---|
| UI | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom |
| Server data (fetch, cache, polling) | @tanstack/react-query |
| Global state | zustand |
| HTTP | axios (streaming ke liye native `fetch`) |
| Markdown | react-markdown + remark-gfm |
| Upload | react-dropzone |
| Charts | recharts |
| Icons | lucide-react |

Koi bhi cheez CDN se load nahi hoti. Sab `npm install` se bundle hota hai, isliye app bina internet ke chalta hai.

---

## 3. Pehli baar setup (step by step)

### Step 1: Node.js install karo
Node **20 ya usse upar** chahiye.
```bash
node -v   # v20.x.x ya upar dikhna chahiye
```

### Step 2: Dependencies install karo
```bash
cd frontend
npm install
```

### Step 3: `.env` file banao
```bash
cp .env.example .env
```
`.env` me do values hain:
```env
VITE_API_URL=/api        # backend ka base path
VITE_USE_MOCKS=true      # true = fake data, backend ki zarurat nahi
```

### Step 4: Dev server chalao
```bash
npm run dev
```
Browser me kholo: **http://localhost:5173**

Upar peeli patti dikhegi "Mock mode". Iska matlab fake data chal raha hai. Sab kuch try kar sakte ho: chat, upload, delete, system page.

### Step 5: Mock mode me test karo
- Chat me likho **"Maintenance checklist ki Excel bana do"**. Isse agent steps, source aur file card sab dikhenge.
- **Smart** mode select karke kuch poochho. Badge me `qwen3:14b` aayega.
- Koi `.png` attach karke poochho. Badge me vision model aayega.
- Knowledge page pe koi PDF daalo. 4 second baad status "Ready" ho jayega.

---

## 4. Backend se jodna

### Step 1: Backend chalao
FastAPI backend `http://localhost:8000` pe chalna chahiye.

### Step 2: Mock mode band karo
`.env` me:
```env
VITE_USE_MOCKS=false
```

### Step 3: Dev server restart karo
```bash
npm run dev
```
`vite.config.ts` me proxy laga hai: `/api/*` wali har request `http://localhost:8000/api/*` pe jaati hai. Isliye CORS ki tension nahi.

### Step 4: Backend ko ye APIs deni hongi

| Method | Endpoint | Request | Response |
|---|---|---|---|
| POST | `/api/chat` | `{ chat_id, message, mode, attachment_ids, use_knowledge }` | `text/event-stream` (neeche dekho) |
| GET | `/api/chats?q=` | – | `Chat[]` (bina messages) |
| GET | `/api/chats/{id}` | – | `Chat` (messages ke saath) |
| PATCH | `/api/chats/{id}` | `{ title }` | – |
| DELETE | `/api/chats/{id}` | – | – |
| POST | `/api/upload` | `multipart/form-data` field `file` | `Document` |
| GET | `/api/documents` | – | `Document[]` |
| GET | `/api/documents/{id}/preview` | – | `{ text }` |
| DELETE | `/api/documents/{id}` | – | – |
| GET | `/api/files` | – | `GeneratedFile[]` |
| GET | `/api/files/{id}` | – | file (binary) |
| DELETE | `/api/files/{id}` | – | – |
| GET | `/api/system/status` | – | `SystemStatus` |
| GET | `/api/network/status` | – | `NetworkStatus` |
| GET | `/api/audit?from=&to=` | – | `AuditLog[]` |

Saare types `src/types/` me hain. Backend ke Pydantic models inhi se match karne chahiye. Errors me `{ "detail": "message" }` bhejo, frontend wahi message dikhayega.

### Step 5: Streaming format (`/api/chat`)
Response header: `Content-Type: text/event-stream`. Har event ek line, `data:` ke saath:

```
data: {"type":"meta","chatId":"c1","messageId":"m9"}
data: {"type":"model","name":"qwen3:14b","reason":"Complex query"}
data: {"type":"step","id":"s1","text":"Documents me search","status":"running"}
data: {"type":"step","id":"s1","text":"Documents me search","status":"done"}
data: {"type":"token","text":"Pump "}
data: {"type":"token","text":"P-101 "}
data: {"type":"source","source":{"docId":"d1","file":"manual.pdf","page":12,"text":"..."}}
data: {"type":"file","file":{"id":"f1","name":"checklist.xlsx","type":"xlsx","size":17400,"chatId":"c1","createdAt":"2026-09-16T10:00:00Z"}}
data: {"type":"done","durationMs":3400}
```

Rules:
- `meta` **sabse pehle** bhejo. Nayi chat ho to backend `chatId` banaye, frontend URL `/chat/{chatId}` pe chala jayega.
- `step` same `id` ke saath dobara bhejo to status update hota hai.
- Error aaye to `{"type":"error","message":"..."}` bhejo.
- Stop button dabane pe frontend request abort karta hai. Backend ko client disconnect pe generation rok deni chahiye.

FastAPI example:
```python
from fastapi.responses import StreamingResponse
import json

@router.post("/chat")
async def chat(req: ChatRequest):
    async def gen():
        yield f"data: {json.dumps({'type': 'meta', 'chatId': chat_id, 'messageId': msg_id})}\n\n"
        async for token in llm.stream(...):
            yield f"data: {json.dumps({'type': 'token', 'text': token})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'durationMs': ms})}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```

---

## 5. Folder structure

```
frontend/
├── public/                  # static files (local fonts/icons yahan)
├── src/
│   ├── main.tsx             # entry: React Query + Router
│   ├── App.tsx              # routes + theme class
│   ├── index.css            # theme colors (design yahin se badlo)
│   ├── api/                 # backend calls (har file me mock + real dono)
│   ├── types/               # TypeScript types = backend contract
│   ├── store/               # zustand: chat, attachments, ui
│   ├── hooks/               # useChatStream, useDocuments, useNetworkStatus...
│   ├── i18n/                # en.json, hi.json
│   ├── pages/               # 5 pages
│   ├── components/
│   │   ├── layout/          # Topbar, NavLinks, NetworkBadge, toggles
│   │   ├── chat/sidebar/    # chat history
│   │   ├── chat/messages/   # message, badge, steps, sources, file card
│   │   ├── chat/input/      # input box, attach, mode, KB toggle
│   │   ├── knowledge/       # upload, table, preview
│   │   ├── files/           # generated files table
│   │   ├── system/          # network, models, services, audit
│   │   └── ui/              # Button, Modal, Table, Badge...
│   ├── utils/               # format helpers, stream parser
│   ├── constants/           # config, routes, polling intervals
│   └── mocks/               # fake data + fake streaming
├── .env / .env.example
├── vite.config.ts           # /api proxy
├── Dockerfile               # build + nginx
└── nginx.conf               # production me /api proxy + streaming
```

### Data kaise flow hota hai
```
Page → hook (hooks/) → api function (api/) → USE_MOCKS ?
                                              ├─ true  → mocks/
                                              └─ false → backend /api
```
Chat ke liye:
```
ChatInput → useChatStream.send() → api/stream.ts → har event → chatStore update → MessageList re-render
```

---

## 6. Naya feature kaise add kare (example)

Maan lo "document ko tag karna" add karna hai:

1. **Type:** `src/types/document.ts` me `tags: string[]` add karo
2. **API:** `src/api/documents.ts` me `updateTags(id, tags)` banao (mock branch bhi likho)
3. **Hook:** `src/hooks/useDocuments.ts` me `useMutation` wala hook banao
4. **Component:** `src/components/knowledge/TagEditor.tsx` banao
5. **Use karo:** `DocumentTable.tsx` me lagao
6. **Mock data:** `src/mocks/documents.json` me tags daalo
7. Backend team ko naya endpoint batao

---

## 7. Design baad me kaise badlein

- **Colors:** `src/index.css` me `:root` (light) aur `.dark` (dark) ke variables badlo. Tailwind classes jaise `bg-accent`, `text-muted` inhi se aati hain.
- **Font:** font files `public/fonts/` me rakho, `index.css` me `@font-face` likho, aur `--font-sans` update karo. Google Fonts link **mat** lagana, air-gap toot jayega.
- **Common pieces:** `src/components/ui/` badlo, poori app me asar dikhega.
- **Network monitor** demo ka sabse important screen hai, ise sabse zyada polish karna.

---

## 8. Production build

### Bina Docker
```bash
npm run build      # output: dist/
npm run preview    # http://localhost:4173 pe test
```

### Docker ke saath
```bash
docker build -t workbench-frontend --build-arg VITE_USE_MOCKS=false .
docker run -p 3000:80 workbench-frontend
```
`nginx.conf` `/api/` ko `http://backend:8000` pe bhejta hai (docker-compose me backend service ka naam `backend` hona chahiye). Streaming ke liye `proxy_buffering off` pehle se laga hai.

### Air-gapped machine pe le jaana
Internet wali machine pe:
```bash
docker save workbench-frontend -o workbench-frontend.tar
```
Offline machine pe:
```bash
docker load -i workbench-frontend.tar
```

---

## 9. Common problems

| Problem | Solution |
|---|---|
| "Backend se connect nahi ho paya" | Backend 8000 port pe chal raha hai? `.env` me `VITE_USE_MOCKS` sahi hai? |
| Jawab ek saath aata hai, word-by-word nahi | Backend `text/event-stream` bhej raha hai? nginx me `proxy_buffering off` hai? |
| `.env` change ka asar nahi | `npm run dev` restart karo (Vite env sirf start pe padhta hai) |
| Page refresh pe mock data reset | Normal hai, mock data memory me rehta hai |
| 404 on refresh (production) | `nginx.conf` me `try_files $uri /index.html` hona chahiye |
| Build me "chunk larger than 500 kB" warning | Sirf warning hai. Baad me pages ko `React.lazy` se split kar sakte ho |

---

## 10. Aage kya karna hai (TODO)

- [ ] Design polish (colors, font, spacing)
- [ ] Backend se real integration test
- [ ] Pages ko `React.lazy` se split karna
- [ ] Hindi translations poore app me (abhi main labels hi hain)
- [ ] Source click karne pe PDF ka wahi page kholna
- [ ] Mobile layout me chat sidebar ko drawer banana
