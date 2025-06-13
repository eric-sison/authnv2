import { AuthorizationRequest, Client } from "../types/oidc";
import { ClientService } from "./ClientService";
import { FlowService } from "./FlowService";
import { ProviderConfigService } from "./ProviderConfigService";
import { isValidUrl } from "@/utils/isValidUrl";

/**
 * AuthorizationService handles the validation and processing of OpenID Connect authorization requests.
 *
 */
export class AuthorizationService {
  /**
   * Constructs a new instance of AuthorizationService.
   *
   * @param flowService Service responsible for initiating authorization flows.
   * @param clientService Service for accessing registered client data.
   * @param oidcConfigService Service providing OIDC provider metadata and configuration validation.
   */
  constructor(
    private readonly flowService: FlowService,
    private readonly clientService: ClientService,
    private readonly config: ProviderConfigService,
  ) {}

  /**
   * Validates the full authorization request according to OpenID Connect and OAuth 2.0 specifications.
   *
   * Steps:
   * - Validates client ID and client status.
   * - Validates provided redirect URI.
   * - Validates scopes (must include 'openid' and only supported scopes).
   * - Validates response type against provider and client configurations.
   * - Checks if nonce is present if implicit or hybrid flow is requested.
   *
   * @param request The authorization request to validate.
   * @throws Error if any validation fails.
   */
  public async validateAuthorizationRequest(request: AuthorizationRequest): Promise<void> {
    const client = await this.clientService.validateClient(request.client_id);

    this.validateRedirectUri(client, request.redirect_uri);
    this.validateScope(request.scope);
    this.assertResponseTypeSupported(request.response_type);
    this.assertResponseTypeAllowedForClient(client, request.response_type);
    this.checkForNonce(request);
  }

  /**
   * Validates that the provided redirect URI is properly formatted and registered for the client.
   *
   * @param client The client object containing registered redirect URIs.
   * @param uri The redirect URI to validate.
   * @throws Error if URI is invalid or not registered.
   */
  private validateRedirectUri(client: Client, uri: string): void {
    if (!isValidUrl(uri)) {
      throw new Error("Requested redirect_uri is not valid");
    }

    const uriAllowed = this.clientService.isRedirectUriAllowed(client, uri);

    if (!uriAllowed) {
      throw new Error("Requested redirect_uri is not valid");
    }
  }

  /**
   * Validates the requested scopes:
   * - Ensures 'openid' is always included.
   * - Ensures all requested scopes are supported by the provider.
   *
   * @param scope Space-delimited list of requested scopes.
   * @throws Error if 'openid' is missing or if any scope is unsupported.
   */
  private validateScope(scope: string): void {
    const isValid = this.config.isOpenIdIncluded(scope);
    const isSupported = this.config.isScopeSupported(scope);

    if (!isValid) {
      throw new Error("Must include openid");
    }

    if (!isSupported.valid) {
      throw new Error(`Scope not supported: ${isSupported.unsupportedScopes.join(", ")}`);
    }
  }

  /**
   * Validates whether the requested response type is supported by the authorization server (globally supported).
   *
   * @param responseType The requested response_type value.
   * @throws Error if response type is not supported.
   */
  private assertResponseTypeSupported(responseType: string): void {
    const isSupported = this.config.isResponseTypeSupported(responseType);

    if (!isSupported) {
      throw new Error(`Unsupported response type: ${responseType}`);
    }
  }

  /**
   * Validates whether the requested response type is allowed for the particular client.
   *
   * @param client The client requesting authorization.
   * @param responseType The response_type requested.
   * @throws Error if client is not allowed to use this response type.
   */
  private assertResponseTypeAllowedForClient(client: Client, responseType: string): void {
    const isAllowed = this.clientService.isResponseTypeAllowed(client, responseType);

    if (!isAllowed) {
      throw new Error(`Response type "${responseType}" is not allowed for client ${client.clientId}`);
    }
  }

  private checkForNonce(request: AuthorizationRequest) {
    const flow = this.flowService.resolveOIDCFlow(request.response_type);

    if ((flow === "implicit" || flow === "hybrid") && !request.nonce) {
      throw new Error("Nonce is required for implicit flow");
    }
  }
}
