export async function isLinkDead(url: string): Promise<boolean> {
  const aliveCodes = [
    200, 201, 202, 203, 204, 205, 206,
    301, 302, 303, 307, 308,
    401, 403, 405 // in case some users needed to redirect their secret thing
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);

  return await fetch(url, {
    method: "HEAD",
    redirect: "manual",
    signal: controller.signal,
    headers: {
      "User-Agent": "j0.si/1.0"
    }
  }).then(res => {
    const resURL = new URL(res.url);

    // prevent redirect loop
    if (resURL.origin === process.env.HOSTNAME) return false;

    clearTimeout(timeout);
    return !aliveCodes.includes(res.status)
  }).catch(() => true)
}