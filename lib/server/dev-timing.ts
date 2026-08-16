/**
 * Development-only timing helper for admin request profiling.
 * Enable with ADMIN_DEV_TIMING=1. No-ops (and silent) otherwise.
 */

type TimingSpan = {
  label: string;
  ms: number;
  at: string;
};

const spans: TimingSpan[] = [];
const MAX_SPANS = 200;

function enabled() {
  return process.env.ADMIN_DEV_TIMING === "1";
}

export async function timeAdminStage<T>(
  label: string,
  run: () => Promise<T>,
): Promise<T> {
  if (!enabled()) {
    return run();
  }

  const started = performance.now();
  try {
    return await run();
  } finally {
    const ms = performance.now() - started;
    const span = {
      label,
      ms: Number(ms.toFixed(1)),
      at: new Date().toISOString(),
    };
    spans.push(span);
    if (spans.length > MAX_SPANS) {
      spans.splice(0, spans.length - MAX_SPANS);
    }
    console.info(`[admin-timing] ${label}: ${span.ms}ms`);
  }
}

export function getAdminTimingSpans() {
  return [...spans];
}

export function clearAdminTimingSpans() {
  spans.length = 0;
}
