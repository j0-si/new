import { Context, Elysia } from 'elysia'
import { prisma } from '../prisma'
import { getLink, isLinkDead, validateLinks, visitLink } from '../utils/link'
import logger from '../utils/logger'

const elysia = new Elysia();

async function linkHandler({ params, status }: Context) {
  
  if (!params.id) return status(400, {
    error: true, 
    message: 'ID_NOT_PROVIDED'
  });

  validateLinks()
  
  const link = await getLink(params.id)
  
  if (!link) {
    return status(404, {
      error: true, 
      message: 'LINK_NOT_FOUND'
    });
  }
  
  if (link?.id) visitLink(link.id);

  logger.info(`access /${link.id} ${JSON.stringify(link, null, 2)}`)

  return { error: false, ...link };
}

elysia.get('/link/:id', linkHandler)
elysia.get('/l/:id', linkHandler)

export const linkRoute = elysia;