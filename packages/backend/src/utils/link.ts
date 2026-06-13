import robotsParser from "robots-parser";
import { prisma } from '../prisma'
import config from "./config";
import { randomstr, random } from './random'

export const idRegex = /^(?!\.)(?=.*[\p{L}\p{Nd}\-_\.]+)(?!.*\.{2,}).*(?<!\+)$/iu
export interface Link {
  id: string,
  url: string,
  caseSensitive: boolean,
  idLowercase: string,
  expiresAt?: Date | null,
  accessLimit?: number | null,
}

async function fetchRobots(url: string | URL): Promise<string> {
  const result = await fetch(new URL('/robots.txt', url));
  return await result.text();
}

const userAgent = process.env.USER_AGENT || "UnnamedUserAgentFromj0.siClone/1.0"

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

export async function getLink(id: string, caseSensitive: boolean = false) {
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

  if (!target) return null;

  // if target.accessLimit was null, that means the target doesn't limit access count
  if (target.accessLimit === null) return target;

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

  return updated;
}

export async function checkIdAvailability(id: string, caseSensitive: boolean = true) {
  const existing = await getLink(id);

  if (!existing && caseSensitive) return true;

  const idDuplicate = await prisma.link.findFirst({ where: {
    idLowercase: id.toLowerCase()
  } });

  return !idDuplicate;
}

export async function createLink(params: {
  url: string,
  id?: string,
  caseSensitive?: boolean,
  expiresAt?: Date,
  expiresIn?: number,
  accessLimit?: number,
}): Promise<{ error: string | false, link?: Link }> {
  let { id, url, caseSensitive = true, expiresAt, expiresIn, accessLimit } = params;

  // Validate ID format
  if (id && !idRegex.test(id)) {
    return { error: "INVALID_ID" }
  }

  // Validate access limit (max value in 32-bit integer)
  if (accessLimit && accessLimit > 2147483647) {
    return { error: "ACCESS_LIMIT_TOO_BIG" }
  }

  // Parse expiration time
  let finalExpiresAt: Date | undefined;
  if (expiresAt) {
    finalExpiresAt = expiresAt
  } else if (expiresIn) {
    finalExpiresAt = new Date(Date.now() + expiresIn)
  }

  // Check if temporary link is already expired
  if (finalExpiresAt && finalExpiresAt.getTime() <= Date.now()) {
    return { error: "LINK_ALREADY_EXPIRED" }
  }

  // Check if ID is available
  if (id) {
    const isIdAvailable = await checkIdAvailability(id, caseSensitive)

    if (!isIdAvailable) {
      return { error: "ID_ALREADY_TAKEN" };
    }
  }

  // Normalize access limit
  if (accessLimit && accessLimit < 1) accessLimit = undefined;

  // Generate unique ID if not provided
  if (!id) {
    caseSensitive = true;

    do {
      id = randomstr(random(4, 5))
    } while (!await checkIdAvailability(id, false))
  }

  // Create data object
  const data: Link = {
    id,
    url,
    caseSensitive,
    expiresAt: finalExpiresAt,
    idLowercase: id.toLowerCase(),
  };

  if (accessLimit) data.accessLimit = accessLimit;

  const link = await prisma.link.create({ data });

  return { error: false, link };
}