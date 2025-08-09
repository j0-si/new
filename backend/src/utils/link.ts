import robotsParser from "robots-parser";
import { prisma } from '../prisma'

async function fetchRobots(url: string | URL): Promise<string> {
  const result = await fetch(new URL('/robots.txt', url));
  return await result.text();
}

const userAgent = process.env.USER_AGENT || "j0.si/1.0"

export async function isLinkDead(url: string): Promise<boolean> {
  const robotsTxtDest = new URL('/robots.txt', url);
  const robots = robotsParser(robotsTxtDest.href, await fetchRobots(url))

  // immediately return true if the URL is disallowed in robots.txt
  if (robots.isDisallowed(url)) return true;

  const aliveCodes = [
    200, 201, 202, 203, 204, 205, 206,
    301, 302, 303, 307, 308,
    401, 403, 405 // in case some users needed to redirect private links
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);

  return await fetch(url, {
    method: "HEAD",
    redirect: "manual",
    signal: controller.signal,
    headers: {
      "User-Agent": userAgent
    }
  }).then(res => {
    const resURL = new URL(res.url);

    // prevent redirect loop
    if (resURL.origin === process.env.HOSTNAME) return false;

    clearTimeout(timeout);
    return !aliveCodes.includes(res.status)
  }).catch(() => true)
}

export async function getLink(id: string, caseSensitive?: boolean) {
  let result = await prisma.link.findUnique({ where: { id } })

  if (!result && !caseSensitive) {
    result = await prisma.link.findFirst({ where: {
      idLowercase: id.toLowerCase(),
      caseSensitive: false
    } })
  }

  return result || undefined
}

export async function removeLink(id: string) {
  // todo: implement remove func
  // await prisma.link.delete
}

export async function validateLink(id: string) {
  const link = await getLink(id)
}