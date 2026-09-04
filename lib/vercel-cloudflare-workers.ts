/**
 * Minimal server-side compatibility surface for native Next.js deployments.
 * OpenAI Sites/Vinext does not use this file; its Vite build resolves the real
 * `cloudflare:workers` module and receives the configured D1 binding.
 */
export const env: { DB?: unknown } = {};
