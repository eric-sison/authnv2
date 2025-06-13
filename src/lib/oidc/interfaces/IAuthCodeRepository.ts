import { AuthorizationCode } from "../types/oidc";

export interface I_AuthCodeRepository {
  /**
   * Saves a new authorization code.
   * @param authCode - The authorization code object to store.
   * @returns A promise that resolves when the authorization code is successfully stored.
   */
  save(authCode: AuthorizationCode): Promise<void>;

  /**
   * Finds an authorization code by its value.
   * @param code - The authorization code string to look up.
   * @returns A promise that resolves to the stored authorization code if found, otherwise `null`.
   */
  findByCode(code: string): Promise<AuthorizationCode | null>;

  /**
   * Marks an authorization code as used.
   * @param code - The authorization code to mark as used.
   * @returns A promise that resolves when the operation is complete.
   */
  markAsUsed(code: string): Promise<void>;

  /**
   * Deletes expired authorization codes.
   * Optional method that can be used for cleanup.
   * @returns A promise that resolves when expired authorization codes are deleted.
   */
  deleteExpired?(): Promise<void>;

  /**
   * Deletes all authorization codes associated with a specific client.
   * Optional method that can be used when deleting a client.
   * @param clientId - The unique identifier of the client whose codes should be deleted.
   * @returns A promise that resolves when the authorization codes are deleted.
   */
  deleteByClientId?(clientId: string): Promise<void>;
}
