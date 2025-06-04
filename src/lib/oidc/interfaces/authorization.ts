import { AuthorizationRequest, AuthorizationResponse } from "../types/oidc";

export interface I_AuthorizationService {
  processAuthorizationRequest(request: AuthorizationRequest): Promise<AuthorizationResponse>;
  validateAuthorizationRequest(request: AuthorizationRequest): void;
}
