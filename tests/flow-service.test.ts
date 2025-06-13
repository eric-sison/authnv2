import { AuthCodeService } from "@/lib/oidc/services/AuthCodeService";
import { OIDCFlowService } from "@/lib/oidc/services/OIDCFlowService";
import { AuthorizationRequest, User } from "@/lib/oidc/types/oidc";
import { beforeEach, describe, expect, it } from "vitest";

let request: AuthorizationRequest;
let user: User;

beforeEach(() => {
  request = {
    client_id: "client-1234",
    redirect_uri: "http://example.com/callback",
    response_type: "code",
    scope: "openid",
  };

  user = {
    id: "user_1",
    isActive: true,
    email: "johndoe@example.com",
    emailVerified: true,
    phoneNumberVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

describe("Test oidc flow based on requested response_type", () => {
  const authCodeService = new AuthCodeService();
  const flowService = new OIDCFlowService(authCodeService);

  it("Should return authorization_code", () => {
    flowService.initiateFlow(request, user);
    expect(flowService.getOIDCFlow()).toEqual("authorization_code");
  });

  /**
   *  Implicit flows
   */

  it("Should return implicit: (token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("implicit");
  });

  it("Should return implicit: (id_token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "id_token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("implicit");
  });

  it("Should return implicit: (both tokens)", () => {
    flowService.initiateFlow({ ...request, response_type: "id_token token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("implicit");
  });

  /**
   * Hybrid flow
   */

  it("Should return hybrid: (code and id_token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "code id_token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("hybrid");
  });

  it("Should return hybrid: (code and token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "code token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("hybrid");
  });

  it("Should return hybrid: (everything)", () => {
    flowService.initiateFlow({ ...request, response_type: "code id_token token" }, user);
    expect(flowService.getOIDCFlow()).toEqual("hybrid");
  });
});

describe("Test authorization_code flow", () => {
  const authCodeService = new AuthCodeService();
  const flowService = new OIDCFlowService(authCodeService);

  it("Should return authorization response", () => {
    const response = flowService.initiateFlow(request, user);
    expect(response.code).toBeDefined();
  });

  it("Should return authorization response with state and nonce", () => {
    const response = flowService.initiateFlow({ ...request, state: "state-001", nonce: "nonce-123" }, user);
    expect(response.state).toEqual("state-001");
    expect(response.nonce).toEqual("nonce-123");
  });
});
