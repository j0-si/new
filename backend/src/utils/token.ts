import { prisma } from "../prisma";
import { chars } from "./random";
import { getUser } from "./user";
import * as crypto from "node:crypto";
import * as bcrypt from "bcrypt";

export async function createRefreshToken(userId: string) {
  const user = await getUser(userId);
  
  if (!user) return;

  const charset = chars.extraSymbols + chars.letterLC + chars.letterUC + chars.numbers + chars.symbols;

  const bytes = Array.from(crypto.randomBytes(64));
  const generated = bytes.map(i => charset[i % charset.length]).join('');

  const tokenData = {
    userId,
    token: generated,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1_000),
  }

  prisma.refreshToken.create({
    data: {
      ...tokenData,
      // store hashed token
      token: await bcrypt.hash(generated, 14),
    }
  })

  return tokenData;
}

export async function validateRefreshToken(token: string) {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        // less than (new Date())
        lt: new Date(),
      }
    }
  })

  
}