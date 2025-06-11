import { ClientRepository } from "../repositories/ClientRepository";

export class ClientService {
  constructor(private readonly repository: ClientRepository) {}

  public getRepository() {
    return this.repository;
  }
}
