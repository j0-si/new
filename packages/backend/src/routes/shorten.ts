import { Elysia } from 'elysia'
import { createLink, isLinkDead, validateLinks, type Link } from '../utils/link'
import logger from '../utils/logger'

const elysia = new Elysia();

elysia.post("/shorten", async ({ body, set }) => {
  try {
    validateLinks()

    let { id, url, caseSensitive, expiresAt: rawExpiresAt, expiresIn, accessLimit } = body as {
      id?: string,
      url: string,
      caseSensitive?: boolean,
      expiresAt?: Date | string,
      expiresIn?: number,
      accessLimit?: number,
    };

    if (!url) {
      return { error: "URL_NOT_PROVIDED" }
    }

    // Validate URL format
    let target;
    try {
      target = new URL(url);
    } catch {
      set.status = 400;
      return { error: "INVALID_URL" };
    }

    // Restrict to HTTP and HTTPS
    if (!/https?\:/.test(target.protocol)) {
      set.status = 400
      return { error: "INVALID_PROTOCOL" }
    }

    // Check if target URL is dead
    if (await isLinkDead(url)) {
      set.status = 400
      return { error: "TARGET_URL_DEAD_OR_DISALLOWED" }
    }

    // Parse expiresAt from string if needed
    let expiresAt: Date | undefined;
    if (rawExpiresAt) {
      expiresAt = new Date(rawExpiresAt)
    }

    // Create the link with validation
    const result = await createLink({
      url,
      id,
      caseSensitive,
      expiresAt,
      expiresIn,
      accessLimit,
    });

    if (result.error) {
      // Map specific errors to HTTP status codes
      if (result.error === "ID_ALREADY_TAKEN") {
        set.status = 409;
      } else if (result.error === "INVALID_ID" || result.error === "LINK_ALREADY_EXPIRED" || result.error === "ACCESS_LIMIT_TOO_BIG") {
        set.status = 400;
      }
      
      return result;
    }

    logger.info(`shorten /${result.link?.id} ${JSON.stringify(result, null, 2)}`)

    return result;
  } catch (error) {
    logger.error(error)

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

export const shortenRoute = elysia;