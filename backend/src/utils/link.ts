import robotsParser from "robots-parser";
import { prisma } from '../prisma'
import config from "./config";

async function fetchRobots(url: string | URL): Promise<string> {
  const result = await fetch(new URL('/robots.txt', url));
  return await result.text();
}

const userAgent = process.env.USER_AGENT || "j0.si/1.0"

export async function isLinkDead(url: string): Promise<boolean> {
  const robotsTxtDest = new URL('/robots.txt', url);
  const robots = robotsParser(robotsTxtDest.href, await fetchRobots(url))

  // return true if the URL is disallowed in robots.txt
  // and config.followRobots is true
  if (robots.isDisallowed(url) && config.followRobots) return true;

  const aliveCodes = [
    200, 201, 202, 203, 204, 205, 206,
    301, 302, 303, 307, 308,
    401, 403, 405 // in case some users needed to redirect private links
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);

  return await fetch(url, {
    method: "GET",
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

export async function getLink(id: string, caseSensitive: boolean = true) {
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
  const deleted = await prisma.link.delete({
    where: { id }
  })

  return deleted
}

export async function validateLinks() {

  // Delete expired links
  await prisma.link.deleteMany({
    where: {
      expiresAt: {
        // less than (new Date())
        lt: new Date(),
      }
    }
  })

  // Delete over-accessed links
  await prisma.link.deleteMany({
    where: {
      accessLimit: {
        lte: 0,
        not: null,
      }
    }
  })

}

export async function visitLink(id: string) {

  const target = await getLink(id);

  // if target.accessLimit was null, that means the target doesn't limit access count
  if (target?.accessLimit === null) return target;

  const updated = await prisma.link.update({
    where: {
      id,
      accessLimit: {
        // null = unlimited
        not: null,
      },
    },
    data: {
      accessLimit: {
        decrement: 1
      } 
    },
  })

  return updated

}

export async function checkIdAvailability(id: string) {
  const existing = await getLink(id, false);

  if (existing) return false;

  const idDuplicate = await prisma.link.findFirst({
    where: {
      idLowercase: id.toLowerCase()
    }
  })

  return !idDuplicate;
}