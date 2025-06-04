import { I_AuthorizationService } from "../interfaces/authorization";
import { AuthorizationRequest, AuthorizationResponse } from "../types/oidc";

export class AuthorizationService implements I_AuthorizationService {
  constructor() {}

  async processAuthorizationRequest(request: AuthorizationRequest): Promise<AuthorizationResponse> {
    throw new Error("Method not implemented.");
  }

  validateAuthorizationRequest(request: AuthorizationRequest): void {
    throw new Error("Method not implemented.");
  }
}
