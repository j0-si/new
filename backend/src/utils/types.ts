import { type Context } from "elysia";

export interface ContextWithIP extends Context {
  ip?: string;
}