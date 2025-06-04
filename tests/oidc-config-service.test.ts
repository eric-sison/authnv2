import { OIDCConfigService } from "@/lib/oidc/services/oidc-config-service";
import { OIDCProvider } from "@/lib/oidc/types/oidc";
import { beforeEach, describe, expect, it } from "vitest";

let baseConfig: OIDCProvider;

beforeEach(() => {
  baseConfig = {
    issuer: "https://example.com",
    authorizationEndpoint: "https://example.com/auth",
    tokenEndpoint: "https://example.com/token",
    userinfoEndpoint: "https://example.com/userinfo",
    jwksUri: "https://example.com/jwks",
    responseTypesSupported: ["code"],
    subjectTypesSupported: ["public"],
    idTokenSigningAlgValuesSupported: ["RS256"],
    scopesSupported: ["openid"],
    claimsSupported: ["sub", "email"],
  };
});

describe("Test validity of OIDC Config", () => {
  it("Should throw an error if issuer is missing", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, issuer: "" })).toThrowError("issuer is required!");
  });

  it("Should throw an error if issuer is not a valid url", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, issuer: "not a valid url" })).toThrowError(
      "issuer must be a valid url!",
    );
  });

  it("Should throw an error if authorization_endpoint is missing", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, authorizationEndpoint: "" })).toThrowError(
      "authorization_endpoint is required!",
    );
  });

  it("Should throw an error if authorization_endpoint is not a valid url", () => {
    expect(
      () => new OIDCConfigService({ ...baseConfig, authorizationEndpoint: "not a valid url" }),
    ).toThrowError("authorization_endpoint must be a valid url!");
  });

  it("Should throw an error if token_endpoint is missing", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, tokenEndpoint: "" })).toThrowError(
      "token_endpoint is required!",
    );
  });

  it("Should throw an error if token_endpoint is not a valid url", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, tokenEndpoint: "not a valid url" })).toThrowError(
      "token_endpoint must be a valid url!",
    );
  });

  it("Should throw an error if userinfo_endpoint is missing", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, userinfoEndpoint: "" })).toThrowError(
      "userinfo_endpoint is required!",
    );
  });

  it("Should throw an error if userinfo_endpoint is not a valid url", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, userinfoEndpoint: "not a valid url" })).toThrowError(
      "userinfo_endpoint must be a valid url!",
    );
  });

  it("Should throw an error if jwks_uri is missing", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, jwksUri: "" })).toThrowError("jwks_uri is required!");
  });

  it("Should throw an error if jwks_uri is not a valid url", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, jwksUri: "not a valid url" })).toThrowError(
      "jwks_uri must be a valid url!",
    );
  });

  it("Should throw an error if response_types_supported is empty", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, responseTypesSupported: [] })).toThrowError(
      "At least one response_types_supported must be included!",
    );
  });

  it("Should throw an error if 'code' is missing from response_types_supported", () => {
    expect(
      () => new OIDCConfigService({ ...baseConfig, responseTypesSupported: ["code id_token"] }),
    ).toThrowError("Must include 'code' in response_types_supported!");
  });

  it("Should throw an error if subject_types_supported is empty", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, subjectTypesSupported: [] })).toThrowError(
      "At least one subject_types_supported must be included!",
    );
  });

  it("Should throw an error if 'public' is missing from subject_types_supported", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, subjectTypesSupported: ["pairwise"] })).toThrowError(
      "Must include 'public' in subject_types_supported!",
    );
  });

  it("Should throw an error if id_token_signing_alg_values_supported is empty", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, idTokenSigningAlgValuesSupported: [] })).toThrowError(
      "At least one id_token_signing_alg_values_supported must be included!",
    );
  });

  it("Should throw an error if 'RS256' is missing from id_token_signing_alg_values_supported", () => {
    expect(
      () => new OIDCConfigService({ ...baseConfig, idTokenSigningAlgValuesSupported: ["ES256"] }),
    ).toThrowError("Must include 'RS256' in id_token_signing_alg_values_supported!");
  });

  it("Should throw an error if scopes_supported is empty", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, scopesSupported: [] })).toThrowError(
      "At least one scopes_supported must be included!",
    );
  });

  it("Should throw an error if 'openid' is missing from scopes_supported", () => {
    expect(() => new OIDCConfigService({ ...baseConfig, scopesSupported: ["address"] })).toThrowError(
      "Must include 'openid' in scopes_supported!",
    );
  });

  it("Should create a valid config with all required fields", () => {
    expect(() => new OIDCConfigService(baseConfig)).not.toThrow();
  });

  it("Should return the generated discovery document", () => {
    const config = new OIDCConfigService(baseConfig);
    const discoveryDocument = config.getDiscoveryDocument();

    expect(discoveryDocument).toEqual({
      issuer: "https://example.com",
      authorization_endpoint: "https://example.com/auth",
      token_endpoint: "https://example.com/token",
      userinfo_endpoint: "https://example.com/userinfo",
      jwks_uri: "https://example.com/jwks",
      response_types_supported: ["code"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256"],
      scopes_supported: ["openid"],
      claims_supported: ["sub", "email"],
      token_endpoint_auth_methods_supported: ["client_secret_basic"],
      grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
    });
  });

  it("Should return correct values from getter methods", () => {
    const config = new OIDCConfigService(baseConfig);

    expect(config.getIssuer()).toBe("https://example.com");
    expect(config.getAuthorizationEndpoint()).toBe("https://example.com/auth");
    expect(config.getTokenEndpoint()).toBe("https://example.com/token");
    expect(config.getUserinfoEndpoint()).toBe("https://example.com/userinfo");
    expect(config.getJwksUri()).toBe("https://example.com/jwks");
    expect(config.getResponseTypesSupported()).toEqual(["code"]);
    expect(config.getSubjectTypesSupported()).toEqual(["public"]);
    expect(config.getIdTokenSigningAlgValuesSupported()).toEqual(["RS256"]);
    expect(config.getScopesSupported()).toEqual(["openid"]);
    expect(config.getClaimsSupported()).toEqual(["sub", "email"]);
  });
});
