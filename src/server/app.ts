import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { auth } from "@/lib/auth";
import { OIDCManager } from "@/lib/oidc/oidcManager";
import { discoveryHandler } from "./routes/discovery";

function createApp() {
  const app = new Hono().basePath("/api");

  /**
   * Mount better-auth handlers into our Hono app.
   * See: https://www.better-auth.com/docs/integrations/hono
   */
  app.on(["POST", "GET"], "/auth/**", (c) => {
    return auth.handler(c.req.raw);
  });

  const routes = [healthcheckHandler, discoveryHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;

export const $oidcManager = await OIDCManager.getInstance();
