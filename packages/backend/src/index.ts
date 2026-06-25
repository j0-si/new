import { Elysia } from 'elysia'
import { shortenRoute } from './routes/shorten'
import { linkRoute } from './routes/link';
import { cors } from '@elysiajs/cors'

const app = new Elysia()

app.use(shortenRoute)
app.use(linkRoute)
app.use(cors())

app.get('/', () => {
  return "Hello, World!\n\nif you have no idea what this page (or link) is about,\nthis is an API for j0.si url shortener.\nthink of it like a robot. j0.si (frontend) is the appearance of the robot,\nwhereas api.j0.si (backend) is the computer manipulating the robot.\n\nfeeling generous to contribute or donate?\nif you want to contribute, feel free to.\nhowever, the repository of this website is quite messy,\nyou might not want to contribute.\nif you can use typescript with nuxt, vue, tailwindcss for frontend,\nelysia, prisma, postgres for backend, and\nyou can actually understand the code of this website,\nyour contribution is welcome.\nif you want to donate, feel free to contact driplase on discord.\nyou can check lase's discord on their website (https://lase.dev)\nbut they might reject your message request especially when they thought the request was a spam.\nalso, they live in japan and rely on paypay and kyash,\nit might be hard to donate especially for users outside of japan.\n\n\nanyway, thanks for using this little tool.\n\nmade with <3 by j0.si developing team (currently only driplase)"
})

app.listen(process.env.PORT || 8051)

console.log(
  `backend is running at ${app.server?.hostname}:${app.server?.port}`
)

