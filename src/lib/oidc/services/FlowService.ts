import { AuthorizationRequest, AuthorizationResponse, FlowType } from "../types/oidc";

/**
 * FlowService handles the logic for determining and executing the proper
 * OpenID Connect authorization flow based on the response_type parameter.
 *
 * Supported flows:
 * - Authorization Code Flow
 * - Implicit Flow
 * - Hybrid Flow
 */
export class FlowService {
  /**
   * Holds the determined flow type for the current request.
   */
  private flowType: FlowType | undefined;

  /**
   * Returns the current flow type.
   *
   * @returns The determined flow type, if any.
   */
  public getFlowType(): FlowType | undefined {
    return this.flowType;
  }

  /**
   * Initiates the authorization flow based on the provided request's response_type.
   *
   * @param request The authorization request to process.
   * @returns The authorization response for the initiated flow.
   * @throws Error if the response_type is unsupported.
   */
  public async initiateFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    this.flowType = this.setFlowType(request.response_type);

    switch (this.flowType) {
      case "authorization_code":
        return await this.handleAuthorizationCodeFlow(request);
      case "implicit":
        return await this.handleImplicitFlow(request);
      case "hybrid":
        return await this.handleHybridFlow(request);
      default:
        throw new Error(`Unsupported response_type: ${request.response_type}`);
    }
  }

  /**
   * Handles the Authorization Code flow.
   *
   * TODO: Implement full flow logic (validation, authentication, code issuance).
   *
   * @param request The authorization request.
   * @returns A placeholder authorization response.
   */
  private async handleAuthorizationCodeFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request params (e.g., response_type, client_id, scope, redirect_uri)
    // 2. Authenticate user (or check session)
    // 3. Generate authorization code
    // 4. Redirect user with ?code=...&state=...
    return {};
  }

  /**
   * Handles the Implicit flow.
   *
   * TODO: Implement full flow logic (validation, authentication, token issuance).
   *
   * @param request The authorization request.
   * @returns A placeholder authorization response.
   */
  private async handleImplicitFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Immediately issue id_token and/or access_token in fragment
    // 4. Redirect with #id_token=...&access_token=...&state=...
    return {};
  }

  /**
   * Handles the Hybrid flow.
   *
   * TODO: Implement full flow logic (validation, authentication, mixed issuance).
   *
   * @param request The authorization request.
   * @returns A placeholder authorization response.
   */
  private async handleHybridFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Issue a mix of code + token or code + id_token or all three
    // 4. Redirect user with appropriate values in query or fragment
    return {};
  }

  /**
   * Determines the flow type based on the requested response_type.
   *
   * @param responseType The response_type string from the request.
   * @returns The determined FlowType.
   */
  private setFlowType(responseType: string): FlowType {
    const parts = responseType.trim().split(/\s+/).sort();

    const isCode = parts.includes("code");
    const isToken = parts.includes("token");
    const isIdToken = parts.includes("id_token");

    if (isCode && (isToken || isIdToken)) {
      return "hybrid";
    }

    if (isCode) {
      return "authorization_code";
    }

    return "implicit";
  }
}
