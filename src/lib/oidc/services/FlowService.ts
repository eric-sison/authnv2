import { normalizer } from "@/utils/normalizer";
import { AuthorizationCodeService } from "./AuthorizationCodeService";
import {
  AuthorizationRequest,
  AuthorizationResponse,
  OIDCCodeChallengeMethods,
  OIDCFlow,
  OIDCScopes,
  User,
} from "../types/oidc";

/**
 * OIDCFlowService handles the logic for determining and executing the proper
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
  private OIDCFlow: OIDCFlow | undefined;

  constructor(private readonly authCodeService: AuthorizationCodeService) {}

  /**
   * Returns the current flow type.
   *
   * @returns The determined flow type, if any.
   */
  public getOIDCFlow(): OIDCFlow | undefined {
    return this.OIDCFlow;
  }

  /**
   * Initiates the appropriate OpenID Connect authorization flow based on the request's response_type.
   *
   * This method determines which flow to execute (Authorization Code, Implicit, or Hybrid)
   * by analyzing the response_type parameter. Once determined, it delegates
   * processing to the corresponding flow handler.
   *
   * - If response_type includes "code" only → Authorization Code Flow.
   * - If response_type includes "token" or "id_token" without "code" → Implicit Flow.
   * - If response_type includes "code" along with "token" and/or "id_token" → Hybrid Flow.
   *
   * @param request - The incoming authorization request to process.
   * @param user - The authenticated user (if available), or null if unauthenticated.
   * @returns A promise resolving to the authorization response produced by the flow.
   * @throws Error if the response_type is unsupported or unrecognized.
   */
  public initiateFlow(request: AuthorizationRequest, user: User): AuthorizationResponse {
    this.OIDCFlow = this.resolveOIDCFlow(request.response_type);

    switch (this.OIDCFlow) {
      // handle authorization code flow
      case "authorization_code":
        return this.handleAuthorizationCodeFlow(request, user);

      // handle implicit flow
      case "implicit":
        return this.handleImplicitFlow(request, user);

      // handle hybrid flow
      case "hybrid":
        return this.handleHybridFlow(request, user);

      // handle unsupported flow
      default:
        throw new Error(`Unsupported response_type: ${request.response_type}`);
    }
  }

  /**
   * Handles the Authorization Code flow.
   *
   * @param request The authorization request.
   * @returns A placeholder authorization response.
   */
  private handleAuthorizationCodeFlow(request: AuthorizationRequest, user: User): AuthorizationResponse {
    // Generate authorization code
    const authorizationCode = this.authCodeService.generateAuthCode({
      userId: user.id,
      clientId: request.client_id,
      redirectUri: request.redirect_uri,
      scope: request.scope.split(" ") as OIDCScopes[],
      codeChallenge: request.code_challenge,
      codeChallengeMethod: request.code_challenge_method as OIDCCodeChallengeMethods | undefined,
    });

    const response: AuthorizationResponse = {
      code: authorizationCode.code,
    };

    if (request.state) {
      response.state = request.state;
    }

    return response;
  }

  /**
   * Handles the Implicit flow.
   *
   * TODO: Implement full flow logic (validation, authentication, token issuance).
   *
   * @param request The authorization request.
   * @returns A placeholder authorization response.
   */
  private handleImplicitFlow(request: AuthorizationRequest, user: User | null): AuthorizationResponse {
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
  private handleHybridFlow(request: AuthorizationRequest, user: User | null): AuthorizationResponse {
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
   * @returns The determined OIDCFlow.
   */
  public resolveOIDCFlow(responseType: string): OIDCFlow {
    const normalized = normalizer(responseType);
    const parts = normalized.split(" ");

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
