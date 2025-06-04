import { I_AuthorizationService } from "../interfaces/authorization";
import { AuthorizationRequest, AuthorizationResponse, FlowType } from "../types/oidc";

export class AuthorizationService implements I_AuthorizationService {
  private flowType: FlowType | undefined;

  async processAuthorizationRequest(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    await this.initiateFlow(request);
    return {};
  }

  public validateAuthorizationRequest(request: AuthorizationRequest): void {
    throw new Error("Method not implemented.");
  }

  public getFlowType() {
    return this.flowType;
  }

  private async initiateFlow(request: AuthorizationRequest) {
    this.flowType = this.setFlowType(request.responseType);

    switch (this.flowType) {
      // authorization code flow
      case "authorization_code":
        return await this.handleAuthorizationCodeFlow(request);

      // implicit flow
      case "implicit":
        return await this.handleImplicitFlow(request);

      // hybrid flow
      case "hybrid":
        return await this.handleHybridFlow(request);

      // throw error
      default:
        throw new Error("response_type is not supported!");
    }
  }

  private async handleAuthorizationCodeFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request params (e.g., response_type, client_id, scope, redirect_uri)
    // 2. Authenticate user (or check session)
    // 3. Generate authorization code
    // 4. Redirect user with ?code=...&state=...
    return {};
  }

  private async handleImplicitFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Immediately issue id_token and/or access_token in fragment
    // 4. Redirect with `#id_token=...&access_token=...&state=...`
    return {};
  }

  private async handleHybridFlow(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Issue a mix of code + token or code + id_token or all three
    // 4. Redirect user with appropriate values in query or fragment
    return {};
  }

  /**
   * Determines the OpenID Connect flow type based on the `response_type` parameter.
   *
   * Rules:
   * - Returns `"hybrid"` if `response_type` includes "code" **and** either "token" or "id_token".
   * - Returns `"authorization_code"` if `response_type` includes only "code".
   * - Returns `"implicit"` if `response_type` includes "token", "id_token", or both, without "code".
   *
   * @param {string} responseType - A space-delimited string of OIDC response types (e.g., "code", "token id_token").
   * @returns {FlowType} - The determined flow type: "authorization_code", "implicit", or "hybrid".
   */
  private setFlowType(responseType: string): FlowType {
    // Split the response_type string by whitespace and sort the parts
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
