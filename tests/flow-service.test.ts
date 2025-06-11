import { FlowService } from "@/lib/oidc/services/FlowService";
import { AuthorizationRequest } from "@/lib/oidc/types/oidc";
import { beforeEach, describe, expect, it } from "vitest";

let request: AuthorizationRequest;

beforeEach(() => {
  request = {
    client_id: "client-1234",
    redirect_uri: "http://example.com/callback",
    response_type: "code",
    scope: "openid",
  };
});

describe("Test the returned flow type based on requested response_type", () => {
  const flowService = new FlowService();

  it("Should return authorization_code", () => {
    flowService.initiateFlow(request);
    expect(flowService.getFlowType()).toEqual("authorization_code");
  });

  /**
   *  Implicit flows
   */

  it("Should return implicit: (token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "token" });
    expect(flowService.getFlowType()).toEqual("implicit");
  });

  it("Should return implicit: (id_token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "id_token" });
    expect(flowService.getFlowType()).toEqual("implicit");
  });

  it("Should return implicit: (both tokens)", () => {
    flowService.initiateFlow({ ...request, response_type: "id_token token" });
    expect(flowService.getFlowType()).toEqual("implicit");
  });

  /**
   * Hybrid flow
   */

  it("Should return hybrid: (code and id_token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "code id_token" });
    expect(flowService.getFlowType()).toEqual("hybrid");
  });

  it("Should return hybrid: (code and token only)", () => {
    flowService.initiateFlow({ ...request, response_type: "code token" });
    expect(flowService.getFlowType()).toEqual("hybrid");
  });

  it("Should return hybrid: (everything)", () => {
    flowService.initiateFlow({ ...request, response_type: "code id_token token" });
    expect(flowService.getFlowType()).toEqual("hybrid");
  });
});
