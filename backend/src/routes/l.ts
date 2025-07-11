import { Elysia, t } from 'elysia'
import { prisma } from '../prisma'
import { randomstr, random } from '../utils/random'
import { isLinkDead } from '../utils/isLinkDead'

export const linkRoute = new Elysia().get('/l/:id', async ({ params, set, status }) => {
  if (!params.id) return status(400, 'ID_NOT_PROVIDED');

  const link = await prisma.link.findUnique({
    where: { id: params.id }
  })

  if (!link) {
    return status(404, 'LINK_NOT_FOUND');
  }

  return link;
})