import { I_AuthorizationService } from "../interfaces/authorization";
import { AuthorizationRequest, AuthorizationResponse, FlowType } from "../types/oidc";

export class AuthorizationService implements I_AuthorizationService {
  private flowType: FlowType | undefined;

  async processAuthorizationRequest(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    throw new Error("Method not implemented.");
  }

  validateAuthorizationRequest(request: AuthorizationRequest): void {
    throw new Error("Method not implemented.");
  }

  public initiateFlow(request: AuthorizationRequest) {
    this.flowType = this.setFlowType(request.responseType);

    switch (this.flowType) {
      // authorization code flow
      case "authorization_code":
        return this.handleAuthorizationCodeFlow(request);

      // implicit flow
      case "implicit":
        return this.handleImplicitFlow(request);

      // hybrid flow
      case "hybrid":
        return this.handleHybridFlow(request);

      // throw error
      default:
        throw new Error("response_type is not supported!");
    }
  }

  public getFlowType() {
    return this.flowType;
  }

  private handleAuthorizationCodeFlow(request: AuthorizationRequest) {
    // TODO: to be implemented
    // 1. Validate request params (e.g., response_type, client_id, scope, redirect_uri)
    // 2. Authenticate user (or check session)
    // 3. Generate authorization code
    // 4. Redirect user with ?code=...&state=...
  }

  private handleImplicitFlow(request: AuthorizationRequest) {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Immediately issue id_token and/or access_token in fragment
    // 4. Redirect with `#id_token=...&access_token=...&state=...`
  }

  private handleHybridFlow(request: AuthorizationRequest) {
    // TODO: to be implemented
    // 1. Validate request
    // 2. Authenticate user
    // 3. Issue a mix of code + token or code + id_token or all three
    // 4. Redirect user with appropriate values in query or fragment
  }

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
