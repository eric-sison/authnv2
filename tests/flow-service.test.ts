import { AuthorizationCodeService } from "@/lib/oidc/services/AuthorizationCodeService";
import { FlowService } from "@/lib/oidc/services/FlowService";
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
  const authCodeService = new AuthorizationCodeService();
  const flowService = new FlowService(authCodeService);

  it("Should return authorization_code", () => {
    expect(flowService.resolveOIDCFlow("code")).toEqual("authorization_code");
  });

  /**
   *  Implicit flows
   */

  it("Should return implicit: (token only)", () => {
    expect(flowService.resolveOIDCFlow("token")).toEqual("implicit");
  });

  it("Should return implicit: (id_token only)", () => {
    expect(flowService.resolveOIDCFlow("id_token")).toEqual("implicit");
  });

  it("Should return implicit: (both tokens)", () => {
    expect(flowService.resolveOIDCFlow("id_token token")).toEqual("implicit");
  });

  /**
   * Hybrid flow
   */

  it("Should return hybrid: (code and id_token only)", () => {
    expect(flowService.resolveOIDCFlow("code id_token")).toEqual("hybrid");
  });

  it("Should return hybrid: (code and token only)", () => {
    expect(flowService.resolveOIDCFlow("code token")).toEqual("hybrid");
  });

  it("Should return hybrid: (everything)", () => {
    expect(flowService.resolveOIDCFlow("code id_token token")).toEqual("hybrid");
  });

  /**
   * Check normalization
   */
  it("Should return hybrid: (unordered response_type)", () => {
    expect(flowService.resolveOIDCFlow("token id_token code")).toEqual("hybrid");
  });
});

describe("Test authorization_code flow", () => {
  const authCodeService = new AuthorizationCodeService();
  const flowService = new FlowService(authCodeService);

  it("Should return authorization response", () => {
    const response = flowService.initiateFlow(request, user);
    expect(response.code).toBeDefined();
  });

  it("Should return authorization response with state", () => {
    const response = flowService.initiateFlow({ ...request, state: "state-001" }, user);
    expect(response.state).toEqual("state-001");
  });
});
