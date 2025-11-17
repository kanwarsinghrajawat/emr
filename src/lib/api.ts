export async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const message = (await res.json().catch(() => ({ error: res.statusText }))) as { error?: string };
    throw new Error(message.error ?? "Request failed");
  }

  return res.json() as Promise<T>;
}
