import { initBotId } from 'botid/client/core';

// Vercel BotID, client half. Attaches an invisible challenge result to the
// requests listed here. Every path here must call checkBotId() on the server,
// and vice versa. The path must match the fetch URL exactly (trailing slash).
initBotId({ protect: [{ path: '/api/lead/', method: 'POST' }] });
