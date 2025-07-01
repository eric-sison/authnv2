import { AuthorizationCodeRepository } from "./repositories/AuthorizationCodeRepository";
import { ClientRepository } from "./repositories/ClientRepository";
import { AuthorizationCodeService } from "./services/AuthorizationCodeService";
import { AuthorizationService } from "./services/AuthorizationService";
import { ClientService } from "./services/ClientService";
import { FlowService } from "./services/FlowService";
import { ProviderConfigService } from "./services/ProviderConfigService";
import { TokenService } from "./services/TokenService";

export class OIDCManager {
  private static instance: OIDCManager | null = null;

  private _authorizationService: AuthorizationService | null = null;
  private _authorizationCodeService: AuthorizationCodeService | null = null;
  private _clientService: ClientService | null = null;
  private _flowService: FlowService | null = null;
  private _providerConfigService: ProviderConfigService | null = null;
  private _tokenService: TokenService | null = null;

  private _authorizationCodeRepository: AuthorizationCodeRepository | null = null;
  private _clientRepository: ClientRepository | null = null;

  private constructor() {}

  private static async init() {
    if (!this.instance) {
      const manager = new OIDCManager();
      await manager.initializeClasses();
      this.instance = manager;
    }
    return this.instance;
  }

  private async initializeClasses() {
    this._authorizationCodeRepository = new AuthorizationCodeRepository();
    this._clientRepository = new ClientRepository();

    this._providerConfigService = new ProviderConfigService({
      issuer: "http://localhost:3001/api",
      authorizationEndpoint: "http://localhost:3001/api/authorization",
      tokenEndpoint: "http://localhost:3001/api/tokens",
      userinfoEndpoint: "http://localhost:3001/api/userinfo",
      jwksUri: "http://localhost:3001/api/.well-known/.jwks.json",
      idTokenSigningAlgValuesSupported: ["RS256"],
      responseTypesSupported: [
        "code",
        "code id_token",
        "code id_token token",
        "code token",
        "id_token",
        "id_token token",
        "token",
      ],
      scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
      subjectTypesSupported: ["pairwise", "public"],
    });

    this._authorizationCodeService = new AuthorizationCodeService();
    this._clientService = new ClientService(this._clientRepository);
    this._flowService = new FlowService(this._authorizationCodeService);
    this._tokenService = new TokenService(this._providerConfigService);
    this._authorizationService = new AuthorizationService(
      this._flowService,
      this._clientService,
      this._providerConfigService,
    );
  }

  public static async getInstance() {
    return this.instance ?? (await this.init());
  }

  get authorizationService(): AuthorizationService | null {
    return this._authorizationService;
  }

  get authorizationCodeService(): AuthorizationCodeService | null {
    return this.authorizationCodeService;
  }

  get clientService(): ClientService | null {
    return this._clientService;
  }

  get flowService(): FlowService | null {
    return this._flowService;
  }

  get providerConfigService(): ProviderConfigService | null {
    return this._providerConfigService;
  }

  get tokenService(): TokenService | null {
    return this._tokenService;
  }
}
