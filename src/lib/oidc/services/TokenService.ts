import { ProviderConfigService } from "./ProviderConfigService";

export class TokenService {
  constructor(private readonly config: ProviderConfigService) {}

  public async exchangeCodeForToken() {}
}
