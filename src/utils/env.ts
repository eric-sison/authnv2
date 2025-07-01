import z4, { ZodError } from "zod/v4";

const EnvSchema = z4.object({
  NEXT_PUBLIC_HOST: z4.url(),
  BETTER_AUTH_URL: z4.url(),
  DB_HOST: z4.string(),
  DB_PORT: z4.coerce.number(),
  DB_USER: z4.string(),
  DB_PASS: z4.string(),
  DB_NAME: z4.string(),
});

export type Env = z4.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as ZodError;

  console.error(z4.treeifyError(zodError));

  process.exit(1);
}

export default env;
