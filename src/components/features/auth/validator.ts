import z4 from "zod/v4";

export const LoginFormSchema = z4.object({
  email: z4.email(),
  password: z4.string().min(8, { error: "Password must be at least 8 characters." }),
});
