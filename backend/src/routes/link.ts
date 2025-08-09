import { Context, Elysia, t } from 'elysia'
import { prisma } from '../prisma'
import { randomstr, random } from '../utils/random'
import { getLink, isLinkDead } from '../utils/link'

const elysia = new Elysia();

async function linkHandler({ params, status }: Context) {
  
  if (!params.id) return status(400, {
    error: true, 
    message: 'ID_NOT_PROVIDED'
  });
  
  const link = await getLink(params.id)
  
  if (!link) {
    return status(404, {
      error: true, 
      message: 'LINK_NOT_FOUND'
    });
  }
  
  return { error: false, ...link };
}

elysia.get('/link/:id', linkHandler)
elysia.get('/l/:id', linkHandler)

export const linkRoute = elysia;