import { Hono } from "hono";
import { $oidcManager } from "../app";

export const discoveryHandler = new Hono()
  .basePath("/.well-known")
  .get("/openid-configuration", async (c) => {
    const document = $oidcManager.providerConfigService?.getDiscoveryDocument();
    return c.json({ ...document });
  });
