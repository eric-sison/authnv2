import { isValidUrl } from "@/utils/is-valid-url";
import type { DiscoveryDocument, OIDCProvider } from "../types/oidc";

export class OIDCConfigService {
  constructor(private readonly config: OIDCProvider) {
    this.validateConfiguration();
  }

  private validateConfiguration() {
    // Issuer validation
    if (!this.config.issuer) {
      throw new Error("issuer is required!");
    }

    if (!isValidUrl(this.config.issuer)) {
      throw new Error("issuer must be a valid url!");
    }

    // Authorization endpoint validation
    if (!this.config.authorizationEndpoint) {
      throw new Error("authorization_endpoint is required!");
    }

    if (!isValidUrl(this.config.authorizationEndpoint)) {
      throw new Error("authorization_endpoint must be a valid url!");
    }

    // Token endpoint validation
    if (!this.config.tokenEndpoint) {
      throw new Error("token_endpoint is required!");
    }

    if (!isValidUrl(this.config.tokenEndpoint)) {
      throw new Error("token_endpoint must be a valid url!");
    }

    // Userinfo endpoint validation
    if (!this.config.userinfoEndpoint) {
      throw new Error("userinfo_endpoint is required!");
    }

    if (!isValidUrl(this.config.userinfoEndpoint)) {
      throw new Error("userinfo_endpoint must be a valid url!");
    }

    // JWKS URI validation
    if (!this.config.jwksUri) {
      throw new Error("jwks_uri is required!");
    }

    if (!isValidUrl(this.config.jwksUri)) {
      throw new Error("jwks_uri must be a valid url!");
    }

    // Response types validation
    if (this.config.responseTypesSupported.length === 0) {
      throw new Error("At least one response_types_supported must be included!");
    }

    if (!this.config.responseTypesSupported.includes("code")) {
      throw new Error("Must include 'code' in response_types_supported!");
    }

    // Subject types validation
    if (this.config.subjectTypesSupported.length === 0) {
      throw new Error("At least one subject_types_supported must be included!");
    }

    if (!this.config.subjectTypesSupported.includes("public")) {
      throw new Error("Must include 'public' in subject_types_supported!");
    }

    // Signing algorithms validation
    if (this.config.idTokenSigningAlgValuesSupported.length === 0) {
      throw new Error("At least one id_token_signing_alg_values_supported must be included!");
    }

    if (!this.config.idTokenSigningAlgValuesSupported.includes("RS256")) {
      throw new Error("Must include 'RS256' in id_token_signing_alg_values_supported!");
    }

    // Scopes validation
    if (this.config.scopesSupported.length === 0) {
      throw new Error("At least one scopes_supported must be included!");
    }

    if (!this.config.scopesSupported.includes("openid")) {
      throw new Error("Must include 'openid' in scopes_supported!");
    }
  }

  public getIssuer() {
    return this.config.issuer;
  }

  public getAuthorizationEndpoint() {
    return this.config.authorizationEndpoint;
  }

  public getTokenEndpoint() {
    return this.config.tokenEndpoint;
  }

  public getUserinfoEndpoint() {
    return this.config.userinfoEndpoint;
  }

  public getJwksUri() {
    return this.config.jwksUri;
  }

  public getResponseTypesSupported() {
    return this.config.responseTypesSupported;
  }

  public getSubjectTypesSupported() {
    return this.config.subjectTypesSupported;
  }

  public getIdTokenSigningAlgValuesSupported() {
    return this.config.idTokenSigningAlgValuesSupported;
  }

  public getScopesSupported() {
    return this.config.scopesSupported;
  }

  public getClaimsSupported() {
    return this.config.claimsSupported;
  }

  public getTokenEndpointAuthMethodsSupported() {
    return this.config.tokenEndpointAuthMethodsSupported;
  }

  public getGrantTypesSupported() {
    return this.config.grantTypesSupported;
  }

  public getCodeChallengeMethodsSupported() {
    return this.config.codeChallengeMethodsSupported;
  }

  public getDiscoveryDocument(): DiscoveryDocument {
    return {
      issuer: this.config.issuer,
      authorization_endpoint: this.config.authorizationEndpoint,
      token_endpoint: this.config.tokenEndpoint,
      userinfo_endpoint: this.config.userinfoEndpoint,
      jwks_uri: this.config.jwksUri,
      response_types_supported: this.config.responseTypesSupported,
      subject_types_supported: this.config.subjectTypesSupported,
      id_token_signing_alg_values_supported: this.config.idTokenSigningAlgValuesSupported,
      scopes_supported: this.config.scopesSupported,
      claims_supported: this.config.claimsSupported,
      token_endpoint_auth_methods_supported: this.config.tokenEndpointAuthMethodsSupported ?? [
        "client_secret_basic",
      ],
      grant_types_supported: this.config.grantTypesSupported ?? [
        "authorization_code",
        "client_credentials",
        "refresh_token",
      ],
      code_challenge_methods_supported: this.config.codeChallengeMethodsSupported ?? ["S256"],
    };
  }
}
