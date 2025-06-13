import { normalizer } from "@/utils/normalizer";
import { ClientRepository } from "../repositories/ClientRepository";
import { Client } from "../types/oidc";

/**
 * ClientService provides operations related to OAuth 2.0 / OIDC registered clients.
 *
 * Responsibilities:
 * - Validates registered clients and their configurations.
 * - Validates allowed response types and redirect URIs for clients.
 * - Exposes repository access for underlying data operations.
 */
export class ClientService {
  /**
   * Constructs a new instance of ClientService.
   *
   * @param repository The repository used to access client data.
   */
  constructor(private readonly repository: ClientRepository) {}

  /**
   * Exposes the internal client repository for lower-level operations.
   *
   * @returns The ClientRepository instance.
   */
  public getRepository() {
    return this.repository;
  }

  /**
   * Validates that a client ID corresponds to a registered and active client.
   *
   * @param id The client ID to validate.
   * @returns The Client object if the client is valid.
   * @throws Error if the client does not exist or is disabled.
   */
  public async validateClient(id: string): Promise<Client> {
    const client = await this.repository.findById(id);

    if (!client) {
      throw new Error(`Client is not registered: ${id}`);
    }

    if (!client.active) {
      throw new Error(`Client is disabled.`);
    }

    return client;
  }

  /**
   * Checks if the requested response type is allowed for the specified client.
   *
   * @param client The client object containing allowed response types.
   * @param responseType The requested response type.
   * @returns True if the response type is allowed, false otherwise.
   */
  public isResponseTypeAllowed(client: Client, responseType: string): boolean {
    const normalizedRequested = normalizer(responseType);
    return client.responseTypes.some((allowed) => normalizer(allowed) === normalizedRequested);
  }

  /**
   * Checks if the provided redirect URI is registered for the client.
   *
   * @param client The client object containing registered redirect URIs.
   * @param uri The redirect URI to validate.
   * @returns True if the redirect URI is allowed, false otherwise.
   */
  public isRedirectUriAllowed(client: Client, uri: string): boolean {
    return client.redirectUris.includes(uri);
  }
}
