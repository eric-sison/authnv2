import { Client } from "../types/oidc";

export interface I_ClientRepository {
  /**
   * Retrieves all registered Client applications.
   *
   * @returns {Promise<Client[]>} A promise that resolves to an array of Client objects.
   */
  findAll(): Promise<Client[]>;

  /**
   * Retrieves a single Client application by its unique identifier.
   *
   * @param {string} id - The unique identifier of the Client application.
   * @returns {Promise<Client | null>} A promise that resolves to the Client object if found, otherwise null.
   */
  findById(id: string): Promise<Client | null>;

  /**
   * Creates a new Client application.
   *
   * @param {Client} client - The Client object containing application details.
   * @returns {Promise<Client>} A promise that resolves to the saved Client object.
   */
  save(client: Client): Promise<Client>;

  /**
   * Updates an existing Client application.
   *
   * @param {string} id - The unique identifier of the Client application to update.
   * @param {Partial<Client>} data - The partial Client object containing fields to update.
   * @returns {Promise<Client>} A promise that resolves to the updated Client object.
   */
  update(id: string, data: Partial<Client>): Promise<Client>;

  /**
   * Deletes a Client application by its unique identifier.
   *
   * @param {string} id - The unique identifier of the Client application to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
