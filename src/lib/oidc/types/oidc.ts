export type OIDCSubjectTypes = "public" | "pairwise";
export type OIDCIdTokenSigningAlgValues = "RS256" | "HS256" | "ES256" | "PS256" | "none";
export type OIDCScopes = "openid" | "profile" | "email" | "address" | "phone" | "offline_access";
export type OIDCCodeChallengeMethods = "S256" | "plain";
export type OIDCGrantTypes = "authorization_code" | "refresh_token" | "client_credentials";
export type OIDCFlow = "authorization_code" | "implicit" | "hybrid";

export type OIDCResponseTypes =
  | "code"
  | "token"
  | "id_token"
  | "id_token token"
  | "code id_token"
  | "code token"
  | "code id_token token";

export type OIDCClaims =
  | "sub"
  | "name"
  | "given_name"
  | "family_name"
  | "middle_name"
  | "nickname"
  | "preferred_username"
  | "profile"
  | "picture"
  | "website"
  | "email"
  | "email_verified"
  | "gender"
  | "birthdate"
  | "zoneinfo"
  | "locale"
  | "phone_number"
  | "phone_number_verified"
  | "address"
  | "updated_at";

export type OIDCTokenEndpointAuthMethods =
  | "client_secret_basic"
  | "client_secret_post"
  | "client_secret_jwt"
  | "private_key_jwt"
  | "none";

export type ProviderConfig = {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  jwksUri: string;
  responseTypesSupported: OIDCResponseTypes[];
  subjectTypesSupported: OIDCSubjectTypes[];
  idTokenSigningAlgValuesSupported: OIDCIdTokenSigningAlgValues[];
  scopesSupported: OIDCScopes[];
  claimsSupported?: OIDCClaims[];
  tokenEndpointAuthMethodsSupported?: OIDCTokenEndpointAuthMethods[];
  grantTypesSupported?: OIDCGrantTypes[];
  codeChallengeMethodsSupported?: OIDCCodeChallengeMethods[];
};

export type DiscoveryDocument = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: OIDCResponseTypes[];
  subject_types_supported: OIDCSubjectTypes[];
  id_token_signing_alg_values_supported: OIDCIdTokenSigningAlgValues[];
  scopes_supported: OIDCScopes[];
  claims_supported?: OIDCClaims[];
  token_endpoint_auth_methods_supported?: OIDCTokenEndpointAuthMethods[];
  grant_types_supported?: OIDCGrantTypes[];
  code_challenge_methods_supported?: OIDCCodeChallengeMethods[];
};

export type AuthorizationRequest = {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: string; // OIDCResponseTypes
  state?: string;
  nonce?: string;
  code_challenge?: string;
  code_challenge_method?: string; // OIDCCodeChallengeMethods
};

export type AuthorizationResponse = {
  // For Authorization Code Flow
  code?: string;

  // For Implicit or Hybrid flows
  access_token?: string;
  token_type?: string;
  id_token?: string;
  expires_in?: number;

  // Always included (if provided in request)
  state?: string;

  // Error handling
  error?: string;
  error_description?: string;
  error_uri?: string;
};

export type Client = {
  clientId: string;
  redirectUris: string[];
  responseTypes: string[];
  grantTypes: string[];
  tokenEndpointAuthMethod?: string;
  active: boolean;
};

export type User = {
  id: string;
  isActive: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  middleName?: string;
  nickname?: string;
  preferredUsername?: string;
  profile?: string;
  website?: string;
  gender?: "Male" | "Female";
  birthdate?: Date;
  zoneinfo?: string;
  locale?: string;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  address?: {
    formatted?: string;
    street_address?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
  email: string;
  emailVerified: boolean;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthorizationCode = {
  code: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  scope: OIDCScopes[];
  issuedAt: Date;
  expiresAt: Date;
  codeChallenge?: string;
  codeChallengeMethod?: OIDCCodeChallengeMethods;
  used: boolean;
};

export type AuthorizationCodePayload = {
  userId: string;
  clientId: string;
  scope: OIDCScopes[];
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: OIDCCodeChallengeMethods;
};
