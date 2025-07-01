import type { auth } from "./auth";
import { inferAdditionalFields, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import env from "../utils/env";
import { openAPI } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), passkeyClient(), openAPI()],
});

export type ClientSession = typeof authClient.$Infer.Session;
