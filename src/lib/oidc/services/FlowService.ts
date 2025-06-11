import { AuthorizationRequest, AuthorizationResponse, FlowType } from "../types/oidc";

export class FlowService {
  private flowType: FlowType | undefined;

  public getFlowType() {
    return this.flowType;
  }

  public async initiateFlow(request: AuthorizationRequest) {
    this.flowType = this.setFlowType(request.response_type);

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
        throw new Error(`Unsupported response_type: ${request.response_type}`);
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
