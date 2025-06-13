import { isValidUrl } from "@/utils/isValidUrl";
import type { DiscoveryDocument, OIDCClaims, OIDCProvider, OIDCScopes } from "../types/oidc";
import { normalizer } from "@/utils/normalizer";

/**
 * OIDCConfigService is responsible for validating and providing access to
 * the OpenID Connect Provider configuration metadata.
 *
 * It ensures that the provided configuration complies with basic OIDC requirements
 * and exposes accessor methods to retrieve relevant configuration fields.
 */
export class OIDCConfigService {
  /**
   * Constructs an OIDCConfigService instance and immediately validates the configuration.
   *
   * @param config The OIDC Provider configuration object.
   * @throws Error if the configuration is invalid or missing required fields.
   */
  constructor(private readonly config: OIDCProvider) {
    this.validateConfiguration();
  }

  /**
   * Validates the provided OIDC Provider configuration for required fields and constraints.
   *
   * Ensures mandatory endpoints, response types, subject types, algorithms, and scopes
   * are present and properly formatted.
   *
   * @throws Error if any validation rule fails.
   */
  private validateConfiguration(): void {
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

    // ID Token signing algorithms validation
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

  /**
   * Accessor for issuer.
   */
  public getIssuer(): string {
    return this.config.issuer;
  }

  /**
   * Accessor for authorization endpoint.
   */
  public getAuthorizationEndpoint(): string {
    return this.config.authorizationEndpoint;
  }

  /**
   * Accessor for token endpoint.
   */
  public getTokenEndpoint(): string {
    return this.config.tokenEndpoint;
  }

  /**
   * Accessor for userinfo endpoint.
   */
  public getUserinfoEndpoint(): string {
    return this.config.userinfoEndpoint;
  }

  /**
   * Accessor for JWKS URI.
   */
  public getJwksUri(): string {
    return this.config.jwksUri;
  }

  /**
   * Accessor for supported response types.
   */
  public getResponseTypesSupported(): string[] {
    return this.config.responseTypesSupported;
  }

  /**
   * Accessor for supported subject types.
   */
  public getSubjectTypesSupported(): string[] {
    return this.config.subjectTypesSupported;
  }

  /**
   * Accessor for supported ID token signing algorithms.
   */
  public getIdTokenSigningAlgValuesSupported(): string[] {
    return this.config.idTokenSigningAlgValuesSupported;
  }

  /**
   * Accessor for supported scopes.
   */
  public getScopesSupported(): string[] {
    return this.config.scopesSupported;
  }

  /**
   * Accessor for supported claims.
   */
  public getClaimsSupported(): OIDCClaims[] | undefined {
    return this.config.claimsSupported;
  }

  /**
   * Accessor for supported token endpoint authentication methods.
   */
  public getTokenEndpointAuthMethodsSupported(): string[] | undefined {
    return this.config.tokenEndpointAuthMethodsSupported;
  }

  /**
   * Accessor for supported grant types.
   */
  public getGrantTypesSupported(): string[] | undefined {
    return this.config.grantTypesSupported;
  }

  /**
   * Accessor for supported PKCE code challenge methods.
   */
  public getCodeChallengeMethodsSupported(): string[] | undefined {
    return this.config.codeChallengeMethodsSupported;
  }

  public isResponseTypeSupported(responseType: string) {
    const normalizedRequested = normalizer(responseType);
    const supportedResponseTypes = this.config.responseTypesSupported;

    return supportedResponseTypes.some((allowed) => normalizer(allowed) === normalizedRequested);
  }

  public isOpenIdIncluded(scope: string) {
    const requestedScopes = scope
      .trim()
      .split(/\s+/)
      .map((s) => s.toLowerCase());

    if (!requestedScopes.includes("openid")) {
      return false;
    }

    return true;
  }

  public isScopeSupported(scope: string) {
    const supportedScopes = this.config.scopesSupported.map((s) => s.toLowerCase());
    const requestedScopes = scope
      .trim()
      .split(/\s+/)
      .map((s) => s.toLowerCase());

    const unsupportedScopes = requestedScopes.filter((s) => !supportedScopes.includes(s));

    return {
      valid: unsupportedScopes.length === 0,
      unsupportedScopes,
    };
  }

  /**
   * Returns the full discovery document as expected by OIDC Discovery specification.
   * Default values are provided for optional fields if not supplied.
   *
   * @returns The discovery document.
   */
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
