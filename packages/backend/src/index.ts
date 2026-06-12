import { Elysia } from 'elysia'
import { prisma } from './prisma'
import { random, randomstr } from './utils/random'
import { isLinkDead } from './utils/link'
import { shortenRoute } from './routes/shorten'
import { linkRoute } from './routes/link';
import { cors } from '@elysiajs/cors'

const app = new Elysia()

app.use(shortenRoute)
app.use(linkRoute)
app.use(cors())

app.listen(process.env.PORT || 8051)

console.log(
  `backend is running at ${app.server?.hostname}:${app.server?.port}`
)

