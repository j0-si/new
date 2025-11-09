import { Elysia } from 'elysia'
import { prisma } from './prisma'
import { random, randomstr } from './utils/random'
import { isLinkDead } from './utils/link'
import { shortenRoute } from './routes/shorten'
import { linkRoute } from './routes/link';
import accountRoute from './routes/account';
import { cors } from '@elysiajs/cors'
import { ip } from "elysia-ip";

const app = new Elysia()

// import every routes
app.use(shortenRoute)
app.use(linkRoute)
app.use(accountRoute)
// CORS
app.use(cors())
// elysia-ip
app.use(ip())

app.listen(process.env.PORT || 8051)

console.log(
  `backend is running at ${app.server?.hostname}:${app.server?.port}`
)

