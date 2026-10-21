export async function request<T>(path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No pudimos consultar el registro.');
    return data as T;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError')
      throw new Error(
        'La consulta tardó demasiado. Todavía no sabemos el resultado. Consultalo de nuevo.',
      );
    if (e instanceof TypeError)
      throw new Error(
        'No hay conexión con el registro. Todavía no sabemos el resultado. Consultalo cuando vuelva la conexión.',
      );
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
