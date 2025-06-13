import { generateCuid } from "@/utils/generateCuid";
import { AuthorizationCode, AuthorizationCodePayload } from "../types/oidc";

export class AuthCodeService {
  private readonly codeExpirationTime: number = 600; // 10 minutes

  public generateAuthCode(payload: AuthorizationCodePayload, expiration?: number) {
    const code = generateCuid();
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
