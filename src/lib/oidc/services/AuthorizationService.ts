import { isValidUrl } from "@/utils/isValidUrl";
import { AuthorizationRequest, AuthorizationResponse, Client, OIDCScopes } from "../types/oidc";
import { ClientService } from "./ClientService";
import { FlowService } from "./FlowService";
import { OIDCConfigService } from "./OIDCConfigService";
import { normalizer } from "@/utils/normalizer";

export class AuthorizationService {
  constructor(
    private readonly flowService: FlowService,
    private readonly clientService: ClientService,
    private readonly oidcConfigService: OIDCConfigService,
  ) {}

  async processAuthorizationRequest(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    await this.validateAuthorizationRequest(request);
    await this.flowService.initiateFlow(request);

    return {
      access_token: "",
      code: "",
      error: "",
      error_description: "",
      error_uri: "",
      expires_in: 0,
      id_token: "",
      state: "",
      token_type: "",
    };
  }

  public async validateAuthorizationRequest(request: AuthorizationRequest): Promise<void> {
    // Check that the client exists in your system.
    // Make sure client is registered and allowed to use requested flow.
    const client = await this.clientService.getRepository().findById(request.client_id);

    if (!client) {
      throw new Error(`Client is not registered: ${request.client_id}`);
    }

    // Verify the client is not disabled or revoked.
    if (!client.active) {
      throw new Error(`Client is disabled.`);
    }

    const redirectUriValid = this.isRedirectUriValid(client, request.redirect_uri);

    if (!redirectUriValid) {
      throw new Error(`Requested redirect_uri is not valid ${request.redirect_uri}`);
    }

    const scopesValid = this.isScopeValid(request.scope);

    if (!scopesValid) {
      throw new Error(`Requested scope/s not valid: ${request.scope}`);
    }

    const responseTypeSupported = this.isResponseTypeSupported(request.response_type);

    if (!responseTypeSupported) {
      throw new Error(`Requested response_type is not supported: ${request.response_type}`);
    }

    const responseTypeAllowed = this.isResponseTypeAllowedForClient(client, request.response_type);

    if (!responseTypeAllowed) {
      throw new Error(`Requested response_type is not allowed for client ${request.client_id}`);
    }
  }

  private validateClient(id: string) {}

  private validateRedirectUri(client: Client, redirectUri: string) {}

  private validateScope(scope: string) {}

  private checkIfResponseTypeIsSupported(responseType: string) {}

  private checkIfResponseTypeIsAllowedForClient(client: Client, responseType: string) {}

  private isRedirectUriValid(client: Client, uri: string) {
    if (!isValidUrl(uri)) {
      return false;
    }

    return client.redirectUris.includes(uri);
  }

  // The scope parameter is REQUIRED and MUST contain the openid scope value.
  private isScopeValid(scope: string) {
    const requestedScopes = scope
      .trim()
      .split(/\s+/)
      .map((s) => s.toLowerCase());

    const supportedScopes = this.oidcConfigService.getDiscoveryDocument().scopes_supported;

    // Must include 'openid'
    if (!requestedScopes.includes("openid")) {
      return false;
    }

    // Every requested scope must be supported
    for (const scope of requestedScopes) {
      if (!supportedScopes.includes(scope as OIDCScopes)) {
        return false;
      }
    }

    return true;
  }

  private isResponseTypeSupported(responseType: string): boolean {
    // The provider needs to verify that the incoming response_type string matches one of its
    // supported response types (exact combination, but ordering is flexible).
    const normalizedRequested = normalizer(responseType);
    const supportedResponseTypes = this.oidcConfigService.getDiscoveryDocument().response_types_supported;
    return supportedResponseTypes.some((allowed) => normalizer(allowed) === normalizedRequested);
  }

  private isResponseTypeAllowedForClient(client: Client, responseType: string): boolean {
    // Normalize because response_type parameters are space-delimited but ordering isn't strictly defined
    // The spec says "code id_token" is equivalent to "id_token code"
    // Normalization makes the comparison order-insensitive
    const normalizedRequested = normalizer(responseType);
    return client.responseTypes.some((allowed) => normalizer(allowed) === normalizedRequested);
  }
}
