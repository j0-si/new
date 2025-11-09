import { prisma } from '../prisma'
import { snowflake } from './snowflake';
import * as bcrypt from "bcrypt"

export async function checkUsernameAvailability(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  return !user
}

interface CreateUser {
  username: string;
  password: string;
}

export async function createUser(userData: CreateUser) {
  const isUsernameAvailable = await checkUsernameAvailability(userData.username);
  if (!isUsernameAvailable) throw "Username already taken";

  const user = await prisma.user.create({
    data: {
      id: snowflake.generate().toString(),
      username: userData.username,
      password: await bcrypt.hash(userData.password, 12),
    }
  })

  const { password, ...result } = user;

  return result;
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) return;

  const { password, ...result } = user;

  return result;
}