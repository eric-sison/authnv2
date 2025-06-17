import { AuthorizationCode, AuthorizationCodePayload } from "../types/oidc";
import { createId } from "@paralleldrive/cuid2";

export class AuthorizationCodeService {
  private readonly codeExpirationTime: number = 600; // 10 minutes

  public generateAuthCode(payload: AuthorizationCodePayload, expiration?: number) {
    const code = createId();
    const expiresAt = expiration
      ? new Date(Date.now() + expiration * 1000)
      : new Date(Date.now() + this.codeExpirationTime * 1000);

    const authCode: AuthorizationCode = {
      ...payload,
      code,
      used: false,
      issuedAt: new Date(),
      expiresAt,
    };

    return authCode;
  }
}
