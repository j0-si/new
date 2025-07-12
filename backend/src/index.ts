import { Elysia } from 'elysia'
import { prisma } from './prisma'
import { random, randomstr } from './utils/random'
import { isLinkDead } from './utils/isLinkDead'
import { shortenRoute } from './routes/shorten'
import { linkRoute } from './routes/link';

const app = new Elysia()

app.use(shortenRoute)
app.use(linkRoute)

app.listen(8051)

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

