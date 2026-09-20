/**
 * Bridge to the BEE S&L platform (the bee-sl-platform backend) through the
 * APISIX gateway. Swap the mock-store calls for these one module at a time.
 *
 * Set NEXT_PUBLIC_API_BASE=http://localhost:9080 in .env.local, then start the
 * backend with `docker compose up` in ../bee-sl-platform.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface ApiModelApplication {
  reference: string;
  brand: string;
  model: string;
  category: string;
  declaredIseer: number;
  stage: string;
  rating?: number;
  regId?: string;
}

/** Spring Boot model-service (via APISIX). */
export const modelApi = {
  list: () => req<ApiModelApplication[]>("/api/v1/model-applications"),
  get: (reference: string) => req<ApiModelApplication>(`/api/v1/model-applications/${reference}`),
  create: (body: Partial<ApiModelApplication>, token?: string) =>
    req<ApiModelApplication>("/api/v1/model-applications", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(body),
    }),
  advance: (reference: string, actor: string, note = "", token?: string) =>
    req<{ reference: string; stage: string; by: string }>(
      `/api/v1/model-applications/${reference}/advance`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify({ actor, note }),
      }
    ),
};

/** NestJS integration-service (via APISIX) — public verification, Valkey-cached. */
export const verifyApi = {
  lookup: (regId: string) =>
    req<{ regId: string; authentic: boolean; brand?: string; model?: string; rating?: number; source: string }>(
      `/api/v1/public/verify/${encodeURIComponent(regId)}`
    ),
};
