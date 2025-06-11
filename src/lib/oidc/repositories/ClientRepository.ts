import { I_ClientRepository } from "../interfaces/IClientRepository";
import { Client } from "../types/oidc";

export class ClientRepository implements I_ClientRepository {
  async findAll(): Promise<Client[]> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<Client | null> {
    throw new Error("Method not implemented.");
  }

  async save(client: Client): Promise<Client> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
