import { I_AuthCodeRepository } from "../interfaces/IAuthCodeRepository";
import { AuthorizationCode } from "../types/oidc";

export class AuthCodeRepository implements I_AuthCodeRepository {
  public async save(authCode: AuthorizationCode): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async findByCode(code: string): Promise<AuthorizationCode | null> {
    throw new Error("Method not implemented.");
  }

  public async markAsUsed(code: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async deleteExpired?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async deleteByClientId?(clientId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
