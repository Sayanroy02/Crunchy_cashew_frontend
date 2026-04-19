import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// ─── All public routes to revalidate ─────────────────────────────────────────
const ROUTES = [
  '/',
  '/about',
  '/shop',
  '/bulk',
  '/blogs',
  '/contact',
  '/track',
  '/privacy',
  '/terms',
  '/refund-policy',
];

// ─── Backend URL to keep Render.com server awake ──────────────────────────────
// Render free tier sleeps after 15 min inactivity — we ping every 10 min to prevent this.
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://crunchy-node-backend.onrender.com';
const BACKEND_PING_URL = `${BACKEND_BASE}/api/health`;

export async function GET(request: NextRequest) {
  // ── 1. Verify the cron secret ────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // No secret configured — only allow calls from Vercel's own cron scheduler
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    if (!isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const start = Date.now();
  const results: Record<string, string> = {};

  // ── 2. Revalidate all pages ──────────────────────────────────────────────────
  for (const route of ROUTES) {
    try {
      revalidatePath(route);
      results[route] = 'revalidated';
    } catch (err) {
      results[route] = `error: ${err instanceof Error ? err.message : 'unknown'}`;
    }
  }

  // Revalidate layout (shared components like navbar, footer, banners)
  revalidatePath('/', 'layout');

  // ── 3. Ping the backend to keep Render.com awake (free tier sleeps after 15 min) ──
  let backendStatus = 'not attempted';
  try {
    const res = await fetch(BACKEND_PING_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(8000), // 8s timeout
      headers: { 'Content-Type': 'application/json' },
    });
    backendStatus = res.ok ? `awake (${res.status})` : `error (${res.status})`;
  } catch (err) {
    backendStatus = `unreachable: ${err instanceof Error ? err.message : 'unknown'}`;
  }

  const elapsed = Date.now() - start;

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    elapsed_ms: elapsed,
    revalidated: results,
    backend: backendStatus,
  });
}
