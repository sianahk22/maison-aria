// Fonction serverless Vercel : POST /api/concierge (réponse d'ARIA) et GET /api/concierge (mode actif).
// Toute la logique est dans server/ariaConcierge.js. Aucun secret n'est renvoyé au navigateur.
import { handleConciergeRequest, isConfigured } from '../server/ariaConcierge.js'

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }

export function GET() {
  return new Response(JSON.stringify({ mode: isConfigured(process.env) ? 'ai' : 'simulated' }), { headers })
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue'
  const { status, body } = await handleConciergeRequest({ rawBody: await request.text(), ip, env: process.env })
  return new Response(JSON.stringify(body), { status, headers })
}
