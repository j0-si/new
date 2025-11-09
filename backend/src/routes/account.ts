import { Context, Elysia, t } from "elysia";
import { ContextWithIP } from "../utils/types";
import { createUser } from "../utils/user";
import { ip } from "elysia-ip";

type CreateUserBody = {
  username: string;
  password: string;
}

const elysia = new Elysia();

elysia.use(ip())

elysia.post('/account/create', async ({ body, status, ip }: ContextWithIP) => {
  const userData = body as CreateUserBody;
  try {
    return await createUser(userData)
  } catch (err) {
    return status(400, err)
  }
}, {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  })
})

elysia.post("/account/login", async ({ body, status, ip, cookie }: ContextWithIP) => {
  
})

export default elysia;