import { AuthorizationService } from "@/lib/oidc/services/authorization-service";
import { AuthorizationRequest } from "@/lib/oidc/types/oidc";
import { beforeEach, describe, expect, it } from "vitest";

let baseAuthorizationRequest: AuthorizationRequest;

beforeEach(() => {
  baseAuthorizationRequest = {
    clientId: "client-1234",
    redirectUri: "http://example.com/callback",
    responseType: "code",
    scope: "openid",
  };
});

describe("Test the returned flow type based on requested response_type", () => {
  const authorizationService = new AuthorizationService();
  it("Should return authorization_code", () => {
    authorizationService.initiateFlow(baseAuthorizationRequest);
    expect(authorizationService.getFlowType()).toEqual("authorization_code");
  });

  /**
   *  Implicit flows
   */

  it("Should return implicit: (token only)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "token" });
    expect(authorizationService.getFlowType()).toEqual("implicit");
  });

  it("Should return implicit: (id_token only)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "id_token" });
    expect(authorizationService.getFlowType()).toEqual("implicit");
  });

  it("Should return implicit: (both tokens)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "id_token token" });
    expect(authorizationService.getFlowType()).toEqual("implicit");
  });

  /**
   * Hybrid flow
   */

  it("Should return hybrid: (code and id_token only)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "code id_token" });
    expect(authorizationService.getFlowType()).toEqual("hybrid");
  });

  it("Should return hybrid: (code and token only)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "code token" });
    expect(authorizationService.getFlowType()).toEqual("hybrid");
  });

  it("Should return hybrid: (everything)", () => {
    authorizationService.initiateFlow({ ...baseAuthorizationRequest, responseType: "code id_token token" });
    expect(authorizationService.getFlowType()).toEqual("hybrid");
  });
});
