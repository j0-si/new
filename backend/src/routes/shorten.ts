import { Elysia } from 'elysia'
import { prisma } from '../prisma'
import { randomstr, random } from '../utils/random'
import { getLink, isLinkDead } from '../utils/link'

const idRegex = /^(?!\.)(?=.*[\p{L}\p{Nd}\-_\.]+)(?!.*\.{2,}).*$/iu

export const shortenRoute = new Elysia().post("/shorten", async ({ body, set }) => {
  try {
    let { id, url, caseSensitive, expiresAt, accessLimit } = body as {
      id?: string,
      url: string,
      caseSensitive: boolean | true,
      expiresAt?: Date,
      accessLimit?: number,
    };

    if (id && !idRegex.test(id)) {
      return { error: "INVALID_ID" }
    }

    let target;

    try {
      target = new URL(url);
    } catch {
      set.status = 400;
      return { error: "INVALID_URL" };
    }

    // restrict to HTTP and HTTPS
    if (!/https?\:/.test(target.protocol)) {
      set.status = 400
      return { error: "INVALID_PROTOCOL" }
    }

    // if ID was provided check is the ID taken
    if (id) {
      const existing = await getLink(id)
      if (
        existing &&
        (
          existing.caseSensitive ||
          existing.id === id ||
          (id && existing.idLowercase === id.toLowerCase())
        )
      ) {
        set.status = 409;
        return { error: "ID_ALREADY_TAKEN" };
      }
    }

    // check target is dead link to reduce ID waste
    if (await isLinkDead(url)) {
      set.status = 400
      return { error: "TARGET_URL_DEAD_OR_DISALLOWED" }
    }

    // make sure requested temporary link is not expired yet
    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      set.status = 400
      return { error: "LINK_ALREADY_EXPIRED" }
    }

    if (accessLimit && accessLimit < 1) accessLimit = undefined;
    
    // generate unique id if id is not provided
    if (!id) {
      do {
        id = randomstr(random(4, 5))
      } while ( await getLink(id) )
    }

    if (!caseSensitive && id) id = id.toLowerCase();

    const data: {
      id: string,
      url: string,
      caseSensitive: boolean,
      idLowercase: string,
      expiresAt?: Date | null,
      accessLimit?: number | null,
    } = {
      id,
      url,
      caseSensitive,
      idLowercase: id?.toLowerCase(),
    };

    if (expiresAt) data.expiresAt = expiresAt;
    if (accessLimit) data.accessLimit = accessLimit;

    const link = await prisma.link.create({ data });

    return { error: false, ...link };
  } catch (error) {
    console.error(error)

    let errorDetail;
    if (error instanceof Error) {
      errorDetail = {
        name: error.name,       
        message: error.message,
      }
    }

    return {
      error: "SOMETHING_WENT_WRONG",
      detail: errorDetail,
    };
  }
});