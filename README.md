## Environment

This project uses `NEXT_PUBLIC_API_URL` as the backend base URL.

### Chat (SSE) backend integration

The consultation page (`/consultation`) is wired to a backend that supports:

- **List chats** (GET): returns chat list array
- **Get messages** (GET): returns messages for a chat
- **Send message** (POST, SSE): returns streaming events in `text/event-stream`

Configure these variables (optional overrides):

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CHAT_STREAM_PATH` (default: `/chat`)
- `NEXT_PUBLIC_CHAT_LIST_PATH` (default: `/chat`)
- `NEXT_PUBLIC_CHAT_MESSAGES_PATH` (default: `/chat/{chatIdx}`)  
  Use `{chatIdx}` placeholder for the selected chat id.

**SSE event format** expected by the frontend:

- `data: {"type":"chatIdx","chatIdx":123}\n\n`
- `data: {"type":"content","content":"안"}\n\n`
- `data: {"type":"done"}\n\n`

