import { ClientRepository } from "@/lib/oidc/repositories/ClientRepository";
import { AuthorizationService } from "@/lib/oidc/services/AuthorizationService";
import { ClientService } from "@/lib/oidc/services/ClientService";
import { FlowService } from "@/lib/oidc/services/FlowService";
import { OIDCConfigService } from "@/lib/oidc/services/OIDCConfigService";
import { AuthorizationRequest, Client, OIDCProvider } from "@/lib/oidc/types/oidc";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { AuthCodeService } from "@/lib/oidc/services/AuthCodeService";

let clients: Client[];
let baseConfig: OIDCProvider;
let mockClientRepository: ClientRepository;
let mockAuthCodeService: AuthCodeService;
let flowService: FlowService;
let clientService: ClientService;
let oidcConfigService: OIDCConfigService;
let authorizationService: AuthorizationService;

beforeAll(() => {
  clients = [
    {
      clientId: "1",
      redirectUris: ["https://example.com/callback"],
      responseTypes: ["code"],
      grantTypes: ["authorization_code"],
      active: true,
    },
    {
      clientId: "3",
      redirectUris: ["https://example.com/callback"],
      responseTypes: ["code"],
      grantTypes: ["authorization_code"],
      active: false,
    },
    {
      clientId: "4",
      redirectUris: ["https://example.com/callback"],
      responseTypes: ["code id_token token"],
      grantTypes: ["authorization_code"],
      active: true,
    },
  ];

  baseConfig = {
    issuer: "https://example.com",
    authorizationEndpoint: "https://example.com/auth",
    tokenEndpoint: "https://example.com/token",
    userinfoEndpoint: "https://example.com/userinfo",
    jwksUri: "https://example.com/jwks",
    responseTypesSupported: [
      "code",
      "code id_token",
      "code id_token token",
      "code token",
      "id_token",
      "id_token token",
      "token",
    ],
    subjectTypesSupported: ["public"],
    grantTypesSupported: ["authorization_code", "client_credentials", "refresh_token"],
    idTokenSigningAlgValuesSupported: ["RS256"],
    scopesSupported: ["openid", "profile"],
    claimsSupported: ["sub", "email"],
  };

  mockClientRepository = {
    findById: vi.fn().mockImplementation(async (id: string) => {
      return clients.find((client) => client.clientId === id) || null;
    }),
    findAll: vi.fn().mockResolvedValue(clients),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  mockAuthCodeService = new AuthCodeService();
  vi.spyOn(mockAuthCodeService, "generateAuthCode").mockResolvedValue({
    code: "code-123",
    clientId: "1",
    redirectUri: "https://test.example/callback",
    scope: ["email", "openid"],
    used: false,
    userId: "user1",
    expiresAt: new Date(),
    issuedAt: new Date(),
  });

  flowService = new FlowService(mockAuthCodeService);
  clientService = new ClientService(mockClientRepository);
  oidcConfigService = new OIDCConfigService(baseConfig);
  authorizationService = new AuthorizationService(flowService, clientService, oidcConfigService);
});

describe("Test the validity of requested parameters", () => {
  const request: AuthorizationRequest = {
    client_id: "1",
    redirect_uri: "https://example.com/callback",
    scope: "openid",
    response_type: "code",
  };

  it("Should throw an error if client is not registered", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({ ...request, client_id: "2" }),
    ).rejects.toThrow("Client is not registered");
  });

  it("Should throw an error if client status is not active", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({ ...request, client_id: "3" }),
    ).rejects.toThrow("Client is disabled");
  });

  it("Should throw if redirect_uri is not a valid url", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({
        ...request,
        client_id: "1",
        redirect_uri: "not a valid url",
      }),
    ).rejects.toThrow("Requested redirect_uri is not valid");
  });

  it("Should throw if redirect_uri does not match in the client's registered redirect_uris", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({
        ...request,
        client_id: "1",
        redirect_uri: "https://expect-error.test/callback",
      }),
    ).rejects.toThrow("Requested redirect_uri is not valid");
  });

  it("Should throw an error if openid is not requested as a scope", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({ ...request, scope: "email profile" }),
    ).rejects.toThrow("Must include openid");
  });

  it("Should throw an error if requested an unsupported scope", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({
        ...request,
        scope: "openid email profile offline_access",
      }),
    ).rejects.toThrow("Scope not supported: email, offline_access");
  });

  it("Should throw an error if the requested response_type is not supported", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({ ...request, response_type: "not supported" }),
    ).rejects.toThrow("Unsupported response type: not supported");
  });

  it("Should accept requested response_type even if the order is reversed", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({
        ...request,
        client_id: "4",
        response_type: "token id_token code",
      }),
    ).resolves.toBeUndefined();
  });

  it("Should throw an error if the requested response_type is not supported by the client", async () => {
    await expect(
      authorizationService.validateAuthorizationRequest({
        ...request,
        client_id: "1",
        response_type: "code id_token",
      }),
    ).rejects.toThrow(`Response type "code id_token" is not allowed for client 1`);
  });
});
